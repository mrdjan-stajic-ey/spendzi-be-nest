import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema()
export class Expense {
  @Prop()
  name: string;
  @Prop()
  description: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
