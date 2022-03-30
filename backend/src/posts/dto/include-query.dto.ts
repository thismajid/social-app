import { PartialType } from '@nestjs/mapped-types';
import { GetPostsDto } from './get-posts.dto';

export class IncludeQueryDto extends PartialType(GetPostsDto) {}
