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

export enum LOG_LEVEL {
  VERBOSE,
  INFO,
  WARNING,
  ERROR,
}

export interface ILog {
  LOG_LEVEL: LOG_LEVEL;
  MESSAGE: string;
  body?: { [key: string]: any };
  [key: string]: any;
}

export const LogSchema = SchemaFactory.createForClass(Log);

export type APP_MODE = 'DEV' | 'PROD';
