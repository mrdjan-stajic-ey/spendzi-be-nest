import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KEYWORD_API } from 'src/api-errors/api-constants';
import { KeywordDTO } from 'src/dto/keywords/keyword.dto';
import { UserService } from 'src/user/user.service';
import { Keyword, KeywordDocument } from './schema/keyword.schema';

@Injectable()
export class KeywordService {
  constructor(
    @InjectModel(Keyword.name)
    private readonly keywordModel: Model<KeywordDocument>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Keyword[]> {
    return await this.keywordModel.find().populate('user').exec();
  }

  async create(keyword: KeywordDTO) {
    //TODO: check if keyword exists by some params if needed;
    const db_keyword = { ...keyword, user: keyword.user };
    return await this.keywordModel.create(db_keyword);
  }
}
