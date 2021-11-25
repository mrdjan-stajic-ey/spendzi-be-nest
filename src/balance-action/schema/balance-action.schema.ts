import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import * as mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { Keyword, KeywordInfluence } from 'src/keyword/schema/keyword.schema';
import { Expense, ExpenseDocument } from 'src/expense/schema/expense.schema';
import { SuperAppDocument, SuperAppSch } from 'src/schema/app.schema';
export type BalanceActionDocument = BalanceAction & SuperAppDocument;

@Schema()
export class BalanceAction extends SuperAppSch {
  @Prop({ enum: Object.keys(KeywordInfluence) })
  phrasesInfluence: string;

  @Prop()
  amount: number;

  @Prop()
  amountLocators: [string, string];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Keyword.name }])
  @Type(() => Keyword)
  phrases: Keyword[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Expense.name }])
  @Type(() => Expense)
  expenseTypes: ExpenseDocument[];
}

export const BalanceActionSchema = SchemaFactory.createForClass(BalanceAction);
