import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

class Message {
  @Prop()
  role : string;
  @Prop()
  content : string;
}

@Schema()
export class Trial {
  @Prop({ default: new mongoose.Types.ObjectId })
  _id: string;

  @Prop()
  talker: string;
  @Prop()
  created: Date;
  @Prop()
  modified: Date;
  @Prop()
  personality: string;

  @Prop()
  messages: Message[];
}

export const TrialSchema = SchemaFactory.createForClass(Trial);
