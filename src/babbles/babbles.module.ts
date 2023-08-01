import { Module } from '@nestjs/common';
import { BabblesController } from './babbles.controller';
import { BabblesService } from './babbles.service';
import { OpenAIService } from 'src/common/openai.service';

import { MongooseModule } from '@nestjs/mongoose';
import { BabbleSchema } from './interfaces/babble.interface';

import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Babble', schema: BabbleSchema }]),
  ],
  controllers: [BabblesController],
  providers: [BabblesService, OpenAIService, JwtService],
})
export class BabblesModule {}
