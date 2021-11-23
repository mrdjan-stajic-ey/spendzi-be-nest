import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Type } from 'class-transformer';
import { Expense } from 'src/expense/schema/expense.schema';
//TODO: this should be called phrase;
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Expense.name }])
  @Type(() => Expense)
  expenseTypes: Expense[]; //TODO: this is not needed here, should only be needed in the balance-action item;
  //remove it from there and insert into balanceAction faster fetching, less duplicates
  // and the phrases should be an array of string`s in the ballanceItem not an expenseItem or whateever it is now
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword).set(
  'toJSON',
  { virtuals: true },
);
