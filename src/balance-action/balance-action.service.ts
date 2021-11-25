import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { BalanceActionDTO } from 'src/dto/balance/balance.action.dto';
import {
  BalanceAction,
  BalanceActionDocument,
  VirtualSchema,
} from './schema/balance-action.schema';
import { KeywordService } from 'src/keyword/keyword.service';
import { KeywordDTO } from 'src/dto/keywords/keyword.dto';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class BalanceActionService {
  constructor(
    @InjectModel(BalanceAction.name)
    private readonly balanceActionModel: Model<BalanceActionDocument>,
    @InjectConnection('DATA_DB')
    private readonly connection: mongoose.Connection,
    private readonly keywordService: KeywordService,
  ) {}

  async findAll(): Promise<BalanceAction[]> {
    return await this.balanceActionModel
      .find()
      .populate('user')
      .populate('phrases')
      .populate('expenseTypes')
      .exec();
  }

  async create(action: BalanceActionDTO, userId: string) {
    return await this.balanceActionModel.create({ ...action, user: userId });
  }

  async getByUser(user: User): Promise<VirtualSchema[]> {
    const bla = await this.balanceActionModel
      .find({ user: user })
      .populate('user')
      .populate('phrases')
      .populate('expenseTypes')
      .exec();
    return bla;
  }

  async creteBalanceAction(action: BalanceActionDTO, userId: string) {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      const { phrases } = action;
      const keywordPromises = [];
      const createKeyWord = async (keyword: KeywordDTO) => {
        return await this.keywordService.create(keyword, userId);
      };

      for (const keyword of phrases) {
        keywordPromises.push(
          createKeyWord({ description: keyword, name: keyword }),
        );
      }
      const keywordIds = await Promise.all<any>(keywordPromises);
      const augmentedAction = {
        ...action,
        phrases: [...keywordIds.map((kw) => kw._id)],
      };
      this.balanceActionModel.create({ ...augmentedAction, user: userId });
      return transactionSession.commitTransaction();
    } catch (error) {
      transactionSession.abortTransaction();
      return error;
    } finally {
      transactionSession.endSession();
    }
  }
}
