import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KeywordDocument = Keyword & Document;

@Schema()
export class Keyword {
  @Prop()
  name: string;

  @Prop()
  description: string;
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword);
