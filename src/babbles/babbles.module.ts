import { Module } from '@nestjs/common';
import { BabblesController } from './babbles.controller';
import { BabblesService } from './babbles.service';
import { OpenAIService } from 'src/common/openai.service';

@Module({
  controllers: [BabblesController],
  providers: [BabblesService, OpenAIService],
})
export class BabblesModule {}
