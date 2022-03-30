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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Me() { id }) {
    return this.postsService.create({
      ...createPostDto,
      creator: {
        connect: { id },
      },
    });
  }

  @Get('/search')
  search(@Query() query: SearchQueryDto) {
    return this.postsService.getPostsBySearch(isEmpty(query) ? null : query);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: GetPostsDto) {
    const { page, limit, ...includeQuery } = query;
    const skip = (page - 1) * limit;
    const total = await this.postsService.countPosts();
    const posts = await this.postsService.findAll(includeQuery, skip, limit);
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
    removeProp(post, 'id');
    removeProp(post, 'email');

    return post;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Me() { id: userId },
  ) {
    return this.postsService.update(
      +id,
      {
        ...updatePostDto,
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
