import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userExist = await this.findOneByEmail(email);
    if (userExist) throw new BadRequestException();
    const user = await this.prismaService.user.create({
      data: createUserDto,
    });
    return this.removePassword(user);
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const user = await this.prismaService.user.update({
      data: updateUserDto,
      where: { id },
    });

    return this.removePassword(user);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.user.delete({ where: { id } });
    return 'User deleted successfully';
  }

  removePassword(users) {
    if (Array.isArray(users)) {
      users.forEach((user) => {
        delete user.password;
      });
    } else {
      delete users.password;
    }

    return users;
  }
}
