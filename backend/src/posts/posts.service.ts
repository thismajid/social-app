import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostsDto } from './dto/get-posts.dto';
import { IncludeQueryDto } from './dto/include-query.dto';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}
  create(createPostDto: Prisma.PostCreateInput) {
    return this.prismaService.post.create({
      data: createPostDto,
      include: {
        creator: true,
      },
    });
  }

  getPostsBySearch(query) {
    const searchedTags = query?.tags?.split(',');
    return this.prismaService.post.findMany({
      where: {
        OR: [
          {
            title: query?.searchQuery,
          },
          {
            tags: { hasSome: searchedTags },
          },
        ],
      },
      include: {
        creator: true,
      },
    });
  }

  findAll(includeQuery: IncludeQueryDto, skip: number, limit: number) {
    let creator: any = false,
      comments: any = false;
    if (includeQuery?.creator !== false) {
      creator = {
        select: {
          firstName: true,
          lastName: true,
        },
      };
    }
    if (includeQuery?.comments !== false) {
      comments = {
        select: {
          body: true,
          author: true,
        },
      };
    }
    return this.prismaService.post.findMany({
      skip: +skip,
      take: +limit,
      include: {
        creator,
        comments,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  countPosts() {
    return this.prismaService.post.count();
  }

  findOne(id: number, query?: IncludeQueryDto) {
    let creator: any = false,
      comments: any = false;
    if (query?.creator !== false) {
      creator = {
        select: {
          firstName: true,
          lastName: true,
        },
      };
    }
    if (query?.comments !== false) {
      comments = {
        select: {
          body: true,
          author: true,
        },
      };
    }
    const post = this.prismaService.post.findUnique({
      where: {
        id: +id,
      },
      include: {
        creator,
        comments,
      },
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  async update(
    id: number,
    updatePostDto: Prisma.PostUpdateInput,
    userId: number,
  ) {
    const post = await this.findOne(id);
    if (post?.creatorId !== userId) throw new UnauthorizedException();
    return this.prismaService.post.update({
      data: updatePostDto,
      where: { id: +id },
    });
  }

  async likePost(id: string, userId: string) {
    const post = await this.findOne(+id);

    const index = post?.likes.findIndex(
      (userIds) => userIds === String(userId),
    );

    if (index === -1) {
      post.likes.push(String(userId));
    } else {
      post.likes = post?.likes.filter((id) => id !== String(userId));
    }

    return await this.prismaService.post.update({
      where: { id: +id },
      data: {
        likes: { set: post.likes },
      },
    });
  }

  async commentPost(postCommentDto: Prisma.CommentCreateInput) {
    return await this.prismaService.comment.create({
      data: postCommentDto,
      include: {
        author: true,
        post: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id);
    if (post?.creatorId !== userId) throw new UnauthorizedException();
    await this.prismaService.post.delete({ where: { id } });
    return 'Post deleted successfully';
  }
}
