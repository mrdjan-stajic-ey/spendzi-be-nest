import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  SuperAppDocument,
  SuperAppSch,
  SuperAppSchema,
} from 'src/schema/app.schema';

export type ExpenseDocument = SuperAppDocument & Expense;

@Schema()
export class Expense extends SuperAppSch {
  @Prop()
  name: string;
  @Prop()
  description: string;
}

export const ExpenseSchema =
  SuperAppSchema && SchemaFactory.createForClass(Expense);
