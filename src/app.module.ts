import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://gozjxhs:gozjxhs@cluster0.ccmfm.mongodb.net/babblemate?retryWrites=true&w=majority'),
    UsersModule
  ],
})
export class AppModule {}
