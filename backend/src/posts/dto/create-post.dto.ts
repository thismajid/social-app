import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  message: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  creator: string;

  @IsString()
  image?: string;

  tags: string[];
}
