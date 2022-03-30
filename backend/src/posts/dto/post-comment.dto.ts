import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PostCommentDto {
  @IsNotEmpty()
  @IsString()
  body: string;
}
