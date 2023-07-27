import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BabblesModule } from './babbles/babbles.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://gozjxhs:gozjxhs@cluster0.ccmfm.mongodb.net/babblemate?retryWrites=true&w=majority'),
    BabblesModule
  ],
})
export class AppModule {}
