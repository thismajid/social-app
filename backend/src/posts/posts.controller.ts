import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Me } from 'src/auth/guards/me.guard';
import { PostCommentDto } from './dto/post-comment.dto';
import { SearchQueryDto } from './dto/search-post.dto';
import { isEmpty } from 'src/util';
import { GetPostsDto } from './dto/get-posts.dto';
import { removeProp } from 'src/util/removeProp';
import { IncludeQueryDto } from './dto/include-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from './storage.config';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Me() { id },
  ) {
    const postImage = image
      ? `http://localhost:3001/uploads/${image.filename}`
      : '';
    const newPost = await this.postsService.create({
      ...{ ...createPostDto, image: postImage },
      creator: {
        connect: { id },
      },
    });
    removeProp(newPost, 'password');

    return newPost;
  }

  @Get('/search')
  async search(@Query() query: SearchQueryDto) {
    const posts = await this.postsService.getPostsBySearch(
      isEmpty(query) ? null : query,
    );
    return posts;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: GetPostsDto) {
    const { limit, page, ...includeQuery } = query;

    const skip = (+page - 1) * +limit;

    const [total, posts] = await Promise.all([
      this.postsService.countPosts(),
      this.postsService.findAll(includeQuery, skip, limit),
    ]);

    return {
      data: removeProp(posts, 'password'),
      currentPage: Number(page),
      numberofPages: Math.ceil(total / limit),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: IncludeQueryDto) {
    const post = await this.postsService.findOne(+id, query);

    removeProp(post, 'password');
    removeProp(post, 'email');

    return post;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Me() { id: userId },
  ) {
    const postImage = image
      ? `http://localhost:3001/uploads/${image.filename}`
      : '';
    return this.postsService.update(
      +postId,
      {
        ...{ ...updatePostDto, image: postImage },
        creator: {
          connect: { id: userId },
        },
      },
      +userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/likePost')
  likePost(@Param('id') id: string, @Me() { id: userId }) {
    return this.postsService.likePost(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/commentPost')
  async commentPost(
    @Body() postCommentDto: PostCommentDto,
    @Param('id') id: string,
    @Me() { id: userId },
  ) {
    return await this.postsService.commentPost({
      ...postCommentDto,
      post: {
        connect: {
          id: +id,
        },
      },
      author: {
        connect: {
          id: userId,
        },
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Me() { id: userId }) {
    return this.postsService.remove(+id, userId);
  }
}
