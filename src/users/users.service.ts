import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  create(user: User) {}

  findAll(): User[] {
    return this.users;
  }
}
