import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  create() {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {}

  update() {}

  remove(id: number) {}
}
