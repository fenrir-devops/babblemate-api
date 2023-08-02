import { Body, Controller, Res, Req, Get, Post, Param, Headers } from '@nestjs/common';
import { BabblesService } from './babbles.service';
import { CreateBabbleDto } from './dto/create-babble.dto';
import { OpenAIService } from 'src/common/openai.service';
import { Response, Request } from 'express';
import { MakeMessageDTO } from './dto/make-message.dto';

import { ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';

@Controller('api/babbles')
@ApiTags("[대화방 관련]")
export class BabblesController {
  constructor(
    private readonly babblesService: BabblesService,
    private readonly openaiService: OpenAIService,
  ) {}


  @Get()
  @ApiOperation({ summary: '대화방 목록', description: '요청자의 대화방 목록이 반환.' })
  @ApiResponse({ status: 200, description: '{요청자, 대화방정보} 를 담은 배열 형태의 객체로 응답 반환' }) 
  @ApiResponse({ status: 401, description: '권한이 없을 때 에러 응답 반환.' }) 
  async handleBabblesListRequest(
    @Headers("Authorization") token : string,
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

  @Post()
  @ApiOperation({ summary: '대화방 생성', description: '부여된 성격으로 대화 상대를 설정 하여 방을 생성.' })
  @ApiResponse({ status: 201, description: '대화방 생성 성공시 대화방의 id가 반환.' }) 
  @ApiResponse({ status: 401, description: '권한이 없을 때 에러 응답 반환.' }) 
  async handleCreateBabbleRequest(
    @Headers("Authorization") token : string,
    @Req() req: Request & { user: string },
    @Body() createBabbleDto: CreateBabbleDto,
    @Res() res: Response,
  ) {
    const { user } = req;
   
    const created = await this.babblesService.create(user, createBabbleDto);

    return res.status(201).json({ message: 'success', babbleId: created._id });
  }

  

  @Post(':id')
  @ApiOperation({ summary: '대화하기', description: '요청자의 메세지를 처리하여 AI의 메세지를 응답으로 반환' })
  @ApiResponse({ status: 200, description: '{role:string , content : string } 형태의 객체로 응답 반환' }) 
  @ApiResponse({ status: 401, description: '권한이 없을 때 에러 응답 반환.' }) 
  async handleConversationRequest(
    @Headers("Authorization") token : string,
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
  @ApiOperation({ summary: '대화 이력', description: '현재 대화방의 모든 대화 내용을 응답으로 반환' })
  @ApiResponse({ status: 200, description: '' }) 
  @ApiResponse({ status: 401, description: '권한이 없을 때 에러 응답 반환.' }) 
  async handleHistoryRequest(
    @Headers("Authorization") token : string,
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
