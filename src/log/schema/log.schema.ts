import { Prop, Schema } from '@nestjs/mongoose';
import {
  createVirtualSchema,
  SuperAppDocument,
  SuperAppSch,
} from 'src/schema/app.schema';

export type APP_MODE = 'DEV' | 'PROD';
export type LogDocument = SuperAppDocument & Log;

@Schema({ collection: 'log' })
export class Log extends SuperAppSch {
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

export const LogSchema = createVirtualSchema(Log);
