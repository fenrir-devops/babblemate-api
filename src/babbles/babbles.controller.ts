
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BabblesService } from './babbles.service';
import { CreateBabbleDto } from './dto/create-babble.dto';
import { OpenAIService } from 'src/common/openai.service';
import { ChatCompletionRequestMessage } from 'openai';
@Controller('babbles')
export class BabblesController {
    constructor(private readonly babblesService : BabblesService, private readonly openaiService: OpenAIService) {}

    @Post(':id')
    async create(@Param('id') id:string, @Body() createBabbleDto : CreateBabbleDto)  {
        await this.babblesService.create(id, createBabbleDto);
        const messaage : ChatCompletionRequestMessage = {"role" : "user", "content" : createBabbleDto.ment};
        return await this.openaiService.createAIbabble(messaage);
    }
}