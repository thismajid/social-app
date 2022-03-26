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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Me } from 'src/auth/guards/me.guard';

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

  @Get()
  findAll() {
    return this.postsService.findAll();
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
