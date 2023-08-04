import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBabbleDto } from './dto/create-babble.dto';
import { Babble } from './interfaces/babble.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MakeMessageDTO } from './dto/make-message.dto';

@Injectable()
export class BabblesService {
  constructor(
    @InjectModel('Babble') private readonly babbleModel: Model<Babble>,
  ) {}

  async create(
    talker: string,
    createBabbleDto: CreateBabbleDto,
  ): Promise<Babble> {
    const babble = {
      talker: talker,
      created: new Date(),
      personality: createBabbleDto.personality,
      modified: new Date(),
      messages: [
        {
          role: 'system',
          content: `너는 ${createBabbleDto.personality} 역할이야. 답변은 말하듯 짧게 1~3 문장으로 해줘. 너무 길면 불편하거든. 잘 부탁해.`,
        },
      ],
    };
    return await this.babbleModel.create(babble);
  }
  async getAllByTalker(talker: string): Promise<Babble[]> {
    return await this.babbleModel.find({ talker: talker }).exec();
  }

  async validateBabbles(id: string, talker: string): Promise<void> {
    const found = await this.babbleModel.findById(id);
    if (!found) {
      throw new NotFoundException('the babble room does not exist');
    }
    if (found.talker !== talker) {
      throw new BadRequestException('the babble room is not your babble room.');
    }
  }

  async pushMessage(
    id : string,
    role : string,
    content: string
  ): Promise<Babble> {
    const result = await this.babbleModel
      .findByIdAndUpdate(
        id,
        {
          $push: { messages: { role : role, content : content} },
          $set: { modified: new Date() },
        },
        { returnDocument: 'after' },
      )
      .exec();
    return result;
  }



  async getHistoryById(id: string): Promise<Babble> {
    console.log(id);
    return await this.babbleModel.findById(id).exec();
  }
}
