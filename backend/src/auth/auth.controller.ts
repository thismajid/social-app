import { Controller, Post, Body, Request } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Request() req) {
    console.log(req.body);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {}
}
