import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeywordDTO } from 'src/dto/keywords/keyword.dto';
import { Keyword, KeywordDocument } from './schema/keyword.schema';

@Injectable()
export class KeywordService {
  constructor(
    @InjectModel(Keyword.name)
    private readonly keywordModel: Model<KeywordDocument>,
  ) {}

  async findAll(): Promise<KeywordDocument[]> {
    return await this.keywordModel.find().populate('user').exec();
  }

  async create(keyword: KeywordDTO, userId: string) {
    return (
      await this.keywordModel.create({ ...keyword, user: userId })
    ).toJSON();
  }
}
