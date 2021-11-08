import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ collection: 'log' })
export class Log {
  @Prop()
  name: string;
  @Prop()
  timestamp: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
