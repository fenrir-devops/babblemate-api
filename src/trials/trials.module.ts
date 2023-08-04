import { Module } from '@nestjs/common';
import { TrialsController } from './trials.controller';
import { TrialsService } from './trials.service';
import { OpenAIService } from 'src/common/openai.service';

import { MongooseModule } from '@nestjs/mongoose';
import { TrialSchema } from './interfaces/trials.interface'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trial', schema: TrialSchema }]),
  ],
  controllers: [TrialsController],
  providers: [TrialsService, OpenAIService],
})
export class TrialsModule {}
