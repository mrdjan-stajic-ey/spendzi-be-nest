import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async create(keyword: KeywordDTO, userId: string) {
    //TODO: check if keyword exists by some params if needed;
    return await this.keywordModel.create({ ...keyword, user: userId });
  }
}
