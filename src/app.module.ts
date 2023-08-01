import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BabblesModule } from './babbles/babbles.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://gozjxhs:gozjxhs@cluster0.ccmfm.mongodb.net/babblemate?retryWrites=true&w=majority',
    ),
    BabblesModule,
    UsersModule,
  ],
})
export class AppModule {}
