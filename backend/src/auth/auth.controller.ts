import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Me } from './guards/me.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    const access_token = this.authService.sign(req.user);

    return {
      result: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
      access_token,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Me() me) {
    console.log(me);

    return me;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.registerUser(createUserDto);

    const access_token = this.authService.sign(user);

    return {
      result: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      access_token,
    };
  }
}
