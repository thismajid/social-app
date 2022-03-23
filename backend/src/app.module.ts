import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PrismaModule, PostsModule],
})
export class AppModule {}
