import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import * as mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { Keyword, KeywordInfluence } from 'src/keyword/schema/keyword.schema';
import { Expense } from 'src/expense/schema/expense.schema';
export type BalanceActionDocument = BalanceAction & Document;

@Schema()
export class BalanceAction {
  @Prop({ enum: Object.keys(KeywordInfluence) })
  phrasesInfluence: string;

  @Prop()
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Keyword.name }])
  @Type(() => Keyword)
  phrases: Keyword[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Expense.name }])
  @Type(() => Expense)
  expenseTypes: Expense[];
}

export const BalanceActionSchema = SchemaFactory.createForClass(
  BalanceAction,
).set('toJSON', { virtuals: true });
