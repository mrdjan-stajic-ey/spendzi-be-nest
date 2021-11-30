import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import * as mongoose from 'mongoose';
import { Type } from 'class-transformer';
import {
  Keyword,
  KeywordDocument,
  KeywordInfluence,
} from 'src/keyword/schema/keyword.schema';
import { Expense, ExpenseDocument } from 'src/expense/schema/expense.schema';
import { SuperAppDocument, SuperAppSch } from 'src/schema/app.schema';

@Schema()
export class BalanceAction extends SuperAppSch {
  @Prop({ enum: Object.keys(KeywordInfluence) })
  phrasesInfluence: string;

  @Prop()
  amount: string;

  @Prop()
  amountLocators: [number, number];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: UserDocument;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Keyword.name }])
  @Type(() => Keyword)
  phrases: KeywordDocument[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Expense.name }])
  @Type(() => Expense)
  expenseTypes: ExpenseDocument[];

  @Prop()
  template: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: BalanceAction.name })
  @Type(() => BalanceAction)
  templateId: BalanceActionDocument;
}

export type BalanceActionDocument = BalanceAction & SuperAppDocument;

export const BalanceActionSchema = SchemaFactory.createForClass(BalanceAction);
