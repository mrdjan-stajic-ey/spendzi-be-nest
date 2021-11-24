import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SmsDTO } from 'src/dto/Sms/sms.dto';
import { User } from 'src/user/schema/user.schema';
import { SmsInfo, SmsInfoDocument } from './schema/sms.schema';

@Injectable()
export class SmsService {
  constructor(
    @InjectModel(SmsInfo.name)
    private readonly smsModel: Model<SmsInfoDocument>,
  ) {}

  async getForUser(user: User): Promise<SmsInfo[]> {
    return await this.smsModel.find({ user }).exec();
  }

  async setSmsInfo(info: SmsDTO, user: string): Promise<SmsInfo> {
    return await this.smsModel.create({ ...info, user: user });
  }
}
