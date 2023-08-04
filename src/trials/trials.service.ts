import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrialDto } from './dto/create-trial.dto';
import { Trial } from './interfaces/trials.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TrialsService {
  constructor(
    @InjectModel('Trial') private readonly trialModel: Model<Trial>,
  ) {}

  async create(CreateTrialDto: CreateTrialDto): Promise<Trial> {
    const found = await this.trialModel
      .findOne({ talker: CreateTrialDto.deviceId })
      .exec();
    if (found) {
      throw new BadRequestException('Already used the trial version.');
    }

    const trial = {
      talker: CreateTrialDto.deviceId,
      created: new Date(),
      personality: CreateTrialDto.personality,
      modified: new Date(),
      messages: [
        {
          role: 'system',
          content: `너는 ${CreateTrialDto.personality} 역할이야. 답변은 말하듯 짧게 1~2 문장으로 해줘. 너무 길면 불편하거든. 잘 부탁해.`,
        },
      ],
    };
    return await this.trialModel.create(trial);
  }

  async validateTrials(deviceId : string): Promise<void> {
    const found = await this.trialModel.findOne({talker : deviceId}).exec();
    if (!found) {
      throw new NotFoundException('Have not applied for a trial version');
    }
  }

  async pushMessage(deviceId: string, role: string, content: string): Promise<Trial> {
    const found = await this.trialModel.findOne({talker : deviceId}).exec();

    if (found.messages.filter((e) => e.role === 'assistant').length >= 3) {
      throw new BadRequestException(
        'Used up all the trial usage opportunities.',
      );
    }

    const result = await this.trialModel
      .findOneAndUpdate(
        {talker : deviceId},
        {
          $push: { messages: { role: role, content: content } },
          $set: { modified: new Date() },
        },
        { returnDocument: 'after' },
      )
      .exec();
    return result;
  }

  async getHistoryByDeviceId(deviceId: string): Promise<Trial> {
    return await this.trialModel.findOne({talker : deviceId}).exec();
  }
}
