import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://gozjxhs:gozjxhs@cluster0.ccmfm.mongodb.net/babblemate?retryWrites=true&w=majority')],
})
export class AppModule {}
