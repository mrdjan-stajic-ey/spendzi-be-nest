import { Prop, Schema } from '@nestjs/mongoose';
import {
  createVirtualSchema,
  SuperAppDocument,
  SuperAppSch,
} from 'src/schema/app.schema';

export type ExpenseDocument = SuperAppDocument & Expense;
@Schema()
export class Expense extends SuperAppSch {
  @Prop()
  name: string;
  @Prop()
  description: string;
}
export const ExpenseSchema = createVirtualSchema(Expense);
