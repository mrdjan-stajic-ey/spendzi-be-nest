import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Type } from 'class-transformer';

export type KeywordDocument = Keyword & Document;
export enum KeywordInfluence {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}
@Schema()
export class Keyword {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  keywordInfluence: KeywordInfluence;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword);
