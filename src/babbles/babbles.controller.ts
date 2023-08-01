import { Body, Controller, Res, Req, Get, Post, Param } from '@nestjs/common';
import { BabblesService } from './babbles.service';
import { CreateBabbleDto } from './dto/create-babble.dto';
import { OpenAIService } from 'src/common/openai.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { MakeMessageDTO } from './dto/make-message.dto';

import { ChatCompletionRequestMessage } from 'openai';
@Controller('api/babbles')
export class BabblesController {
  constructor(
    private readonly babblesService: BabblesService,
    private readonly openaiService: OpenAIService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async handleCreateBabbleRequest(
    @Req() req: Request & { user: string },
    @Body() createBabbleDto: CreateBabbleDto,
    @Res() res: Response,
  ) {
    const { user } = req;
   
    const created = await this.babblesService.create(user, createBabbleDto);

    return res.status(201).json({ message: 'success', babbleId: created._id });
  }

  @Get()
  async handleBabblesListRequest(
    @Req() req: Request & { user?: string },
    @Res() res: Response,
  ) {
    const { user } = req;
    const founds = await this.babblesService.getAllByTalker(user);

    return res.status(200).json({
      message: 'success',
      talker: user,
      babbles: founds.map((e) => ({
        _id: e._id,
        modified: e.modified,
        personality: e.personality,
      })),
    });
  }

  @Post(':id')
  async handleConversationRequest(
    @Req() req: Request & { user?: string },
    @Res() res: Response,
    @Param('id') id: string,
    @Body() makeMessageDto: MakeMessageDTO,
  ) {
    const { user } = req;
    
    await this.babblesService.validateBabbles(id, user);

    const updated = await this.babblesService.pushMessage(id, "user", makeMessageDto.content);

    // console.log(updated);
    const ais = await this.openaiService.createAIbabble(
      updated.messages.map((one) => ({ role: one.role, content: one.content })),
    );
    
    await this.babblesService.pushMessage(id, "assistant", ais.content);

    return res.status(200).json(ais);
  }


  @Get(':id')
  async handleHistoryRequest(
    @Req() req: Request & { user?: string },
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const { user } = req;
    
    await this.babblesService.validateBabbles(id, user);

    const data = await this.babblesService.getHistoryById(id);
    console.log(data);
    return res.status(200).json(data);
  }
}
