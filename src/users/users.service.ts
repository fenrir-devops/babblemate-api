import { Injectable, BadRequestException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(signupDto: SignUpDto): Promise<User> {
    const created = await this.userModel.create(signupDto);
    return created;
  }
  async authenticate(singinDto: SignInDto): Promise<Boolean> {
    console.log(singinDto);
    const found = await this.userModel
      .findOne({ userId: singinDto.userId })
      .exec();
    if (found?.userPassword !== singinDto.userPassword) {
      throw new BadRequestException('Invalid username or password..');
    }

    return true;
  }
}
