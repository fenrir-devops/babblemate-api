import { Body, Controller, Res, Req, Get, Post, Param } from '@nestjs/common';
import { TrialsService } from './trials.service';
import { CreateTrialDto } from './dto/create-trial.dto';
import { MakeTrialMessageDTO } from './dto/make-trial-message.dto';
import { OpenAIService } from 'src/common/openai.service';
import { Response } from 'express';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/trials')
@ApiTags('[체험판 관련]')
export class TrialsController {
  constructor(
    private readonly trialsService: TrialsService,
    private readonly openaiService: OpenAIService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '체험판 생성',
    description:
      '부여된 성격으로 대화 상대를 설정 하여 방을 생성.(deviceId 필요)',
  })
  @ApiResponse({
    status: 201,
    description: '대화방 생성 성공시 대화방의 id = (deviceId) 가 반환.',
  })
  @ApiResponse({
    status: 400,
    description: '이미 체험판을 이용한적이 있다면 에러응답.',
  })
  async handleTrialRequest(
    @Body() createTrialDto: CreateTrialDto,
    @Res() res: Response,
  ) {
    const created = await this.trialsService.create(createTrialDto);
    return res
      .status(201)
      .json({ message: 'success', trialId: createTrialDto.deviceId });
  }


  @Get(':deviceId')
  @ApiOperation({
    summary: '체험판 기록 확인하기',
    description: '특정 디바이스의 체험판 기록을 응답으로 반환.',
  })
  @ApiResponse({
    status: 400,
    description:
      '체험판 신청한적이 없다면 에러 응답 반환.',
  })
  async handleTrialHistoryRequest(
    @Res() res: Response,
    @Param('deviceId') deviceId: string,
  ) {
    await this.trialsService.validateTrials(deviceId);

    const log = await this.trialsService.getHistoryByDeviceId(deviceId);
    log.messages.shift();
    return res.status(200).json(log);
  }


  @Post(':deviceId')
  @ApiOperation({
    summary: '체험판 대화하기',
    description: '요청자의 메세지를 처리하여 AI의 메세지를 응답으로 반환.',
  })
  @ApiResponse({
    status: 200,
    description: '{role:string , content : string } 형태의 객체로 응답 반환',
  })
  @ApiResponse({
    status: 400,
    description:
      '체험판 ID가 잘못되었거나, 이미 3번 이상 사용했을때 에러 응답 반환.',
  })
  async handleTrialConversationRequest(
    @Res() res: Response,
    @Param('deviceId') deviceId: string,
    @Body() makeTrialMessageDto: MakeTrialMessageDTO,
  ) {
    await this.trialsService.validateTrials(deviceId);

    const updated = await this.trialsService.pushMessage(
      deviceId,
      'user',
      makeTrialMessageDto.content,
    );

    // console.log(updated);
    const ais = await this.openaiService.createAIbabble(
      updated.messages.map((one) => ({ role: one.role, content: one.content })),
    );

    await this.trialsService.pushMessage(deviceId, 'assistant', ais.content);

    return res.status(200).json(ais);
  }

 
}
