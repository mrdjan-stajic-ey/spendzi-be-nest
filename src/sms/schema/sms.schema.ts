import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import * as mongoose from 'mongoose';
import { Type } from 'class-transformer';

export type SmsInfoDocument = SmsInfo & Document;

@Schema()
export class SmsInfo {
  @Prop()
  content: string;

  @Prop()
  caller: string;

  @Prop()
  timestamp: string;

  @Prop()
  isReviewd: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;
}

export const SmsInfoSchema = SchemaFactory.createForClass(SmsInfo).set(
  'toJSON',
  { virtuals: true },
);
