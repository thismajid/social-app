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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Me } from 'src/auth/guards/me.guard';
import { start } from 'repl';

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
  search(@Query() query) {
    const { searchQuery, tags } = query;
    return this.postsService.getPostsBySearch(searchQuery, tags);
  }

  @Get()
  async findAll(@Query() query) {
    const page = Number(query.page) || 1;
    const take = 8;
    const skip = (page - 1) * take;
    const total = await this.postsService.countPosts();
    const posts = await this.postsService.findAll(take, skip);
    return {
      data: posts,
      currentPage: Number(page),
      numberofPages: Math.ceil(total / take),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Me() { id: userId },
  ) {
    console.log(id, updatePostDto);

    return this.postsService.update(+id, {
      ...updatePostDto,
      creator: {
        connect: { id: userId },
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/likePost')
  likePost(@Param('id') id: string, @Me() { id: userId }) {
    return this.postsService.likePost(id, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Me() { id: userId }) {
    return this.postsService.remove(+id);
  }
}
