import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { hash, compare } from 'bcrypt';
import { OAuthUserDto } from 'src/users/dto/oAuth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await this.comparePassword(pass, user.password)))
      return false;
    const { password, ...result } = user;
    return result;
  }

  async hashPassword(password: string) {
    return await hash(password, 10);
  }

  async comparePassword(password: string, hashPassword: string) {
    return await compare(password, hashPassword);
  }

  sign(user: User) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return accessToken;
  }

  async registerUser(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    return await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  randomPassword() {
    return Math.random().toString(36).slice(2, 10);
  }

  async oAuth(oAuthUserDto: OAuthUserDto) {
    const hashedPassword = await this.hashPassword(this.randomPassword());
    return await this.usersService.oAuth({
      ...oAuthUserDto,
      password: hashedPassword,
    });
  }
}
