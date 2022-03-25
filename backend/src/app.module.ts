import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, PostsModule, AuthModule, UsersModule],
})
export class AppModule {}
