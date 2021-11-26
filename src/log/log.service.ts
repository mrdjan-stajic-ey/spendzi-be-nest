import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  APP_MODE,
  ILog,
  Log,
  LogDocument,
  LOG_LEVEL,
} from './schema/log.schema';
@Injectable()
export class LogService {
  private APP_MODE: APP_MODE;
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
    private readonly configService: ConfigService,
  ) {
    this.APP_MODE = (this.configService.get<string>('APP_MODE') ||
      'PROD') as unknown as APP_MODE; //trust me bro
  }

  async findAll(): Promise<Log[]> {
    return this.logModel.find().exec();
  }

  async helloWorld(): Promise<any> {
    console.log('Log middleware from service');
    return Promise.resolve();
  }

  async unhandledException(error): Promise<void> {
    try {
      console.log('Unhandled exception', error);
    } catch (error) {
      this.log({
        LOG_LEVEL: LOG_LEVEL.ERROR,
        MESSAGE: 'UNHANDLED_EXCEPTION',
        body: {
          error: error,
        },
      });
    }
    return Promise.resolve();
  }

  async unhandledPromiseReject(error): Promise<void> {
    try {
      console.log('Unhandled promiseReject', error);
    } catch (error) {
      this.log({
        LOG_LEVEL: LOG_LEVEL.ERROR,
        MESSAGE: 'UNHANDLED_PROMISE_REJECT',
        body: {
          error: error,
        },
      });
    }
    return Promise.resolve();
  }

  private stringifyBody(body: { [key: string]: any }) {
    return JSON.stringify(body);
  }

  async log(log: ILog): Promise<void> {
    if (this.APP_MODE == 'DEV') {
      console.table({
        ...log,
        LOG_LEVEL: LOG_LEVEL[log.LOG_LEVEL],
        body: this.stringifyBody(log.body),
      });
    } else {
      if (log.LOG_LEVEL > LOG_LEVEL.VERBOSE) {
        console.log('THIS SHOULD GO TO DB');
        console.table(log);
      }
    }
    return Promise.resolve();
  }
}
