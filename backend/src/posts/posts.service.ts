import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}
  create(createPostDto: Prisma.PostCreateInput) {
    return this.prismaService.post.create({
      data: createPostDto,
      include: {
        creator: true, // Include all posts in the returned object
      },
    });
  }

  getPostsBySearch(title: any, searchedTags: string[]) {
    return this.prismaService.post.findMany({
      where: {
        OR: [
          {
            title,
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

  findAll(take: number, skip: number) {
    return this.prismaService.post.findMany({
      skip: +skip,
      take: +take,
      include: {
        creator: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  countPosts() {
    return this.prismaService.post.count();
  }

  findOne(id: number) {
    const post = this.prismaService.post.findUnique({
      where: {
        id: +id,
      },
      include: {
        creator: true,
      },
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  async update(id: number, updatePostDto: Prisma.PostUpdateInput) {
    await this.findOne(id);
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

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.post.delete({ where: { id } });
  }
}
