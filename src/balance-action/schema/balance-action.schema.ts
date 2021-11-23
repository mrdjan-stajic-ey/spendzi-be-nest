import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import * as mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { Keyword, KeywordInfluence } from 'src/keyword/schema/keyword.schema';
export type BalanceActionDocument = BalanceAction & Document;

@Schema()
export class BalanceAction {
  @Prop({ enum: Object.keys(KeywordInfluence) }) //TODO: find a better way to handle this, dont think there is one, but google a bit more
  phrasesInfluence: string;

  @Prop()
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Keyword.name }])
  @Type(() => Keyword)
  phrases: Keyword[];
}

export const BalanceActionSchema = SchemaFactory.createForClass(
  BalanceAction,
).set('toJSON', { virtuals: true });
