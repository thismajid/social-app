import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}
  create(createPostDto: Prisma.PostCreateInput) {
    return this.prismaService.post.create({ data: createPostDto });
  }

  findAll() {
    return this.prismaService.post.findMany();
  }

  // findOne(id: number) {
  //   const post = this.prismaService.post.findUnique({ where: { id } });
  //   if (!post) throw new NotFoundException();
  //   return post;
  // }

  // async update(id: number, updatePostDto: Prisma.PostUpdateInput) {
  //   await this.findOne(id);
  //   return this.prismaService.post.update({
  //     data: updatePostDto,
  //     where: { id },
  //   });
  // }

  // async remove(id: number) {
  //   await this.findOne(id);
  //   return this.prismaService.post.delete({ where: { id } });
  // }
}
