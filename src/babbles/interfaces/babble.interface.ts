import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Babble {
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

  @Prop([{ role: { type: String }, content: { type: String } }])
  messages: { role: { type: String }; content: { type: String } }[];
}

export const BabbleSchema = SchemaFactory.createForClass(Babble);
