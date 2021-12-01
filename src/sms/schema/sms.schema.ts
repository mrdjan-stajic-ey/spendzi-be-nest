import { Prop, Schema } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import * as mongoose from 'mongoose';
import { Type } from 'class-transformer';
import {
  createVirtualSchema,
  SuperAppDocument,
  SuperAppSch,
} from 'src/schema/app.schema';

export type SmsInfoDocument = SuperAppDocument & SmsInfo;

@Schema()
export class SmsInfo extends SuperAppSch {
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

export const SmsInfoSchema = createVirtualSchema(SmsInfo);
