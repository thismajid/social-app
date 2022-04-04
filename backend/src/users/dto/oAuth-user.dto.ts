import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OAuthUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  givenName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  familyName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  password?: string;
}
