import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schema/log.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
  ) {}

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
      //We can do anything herel;
    }
    return Promise.resolve();
  }

  async unhandledPromiseReject(error): Promise<void> {
    try {
      console.log('Unhandled promiseReject', error);
    } catch (error) {
      //We can do anything herel;
    }
    return Promise.resolve();
  }
}
