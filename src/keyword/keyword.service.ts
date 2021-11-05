import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Keyword, KeywordDocument } from './schema/keyword.schema';

@Injectable()
export class KeywordService {
  constructor(
    @InjectModel(Keyword.name)
    private readonly keywordModel: Model<KeywordDocument>,
  ) {}

  async findAll(): Promise<Keyword[]> {
    return await this.keywordModel.find().exec();
  }
}
