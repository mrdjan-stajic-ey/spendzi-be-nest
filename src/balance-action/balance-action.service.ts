import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { BalanceActionDTO } from 'src/dto/balance/balance.action.dto';
import {
  BalanceAction,
  BalanceActionDocument,
} from './schema/balance-action.schema';
import { KeywordService } from 'src/keyword/keyword.service';
import { KeywordDTO } from 'src/dto/keywords/keyword.dto';
import { UserDocument } from 'src/user/schema/user.schema';
import { LogService } from 'src/log/log.service';
import { LOG_LEVEL } from 'src/log/schema/log.schema';
import { ExpenseDocument } from 'src/expense/schema/expense.schema';

@Injectable()
export class BalanceActionService {
  constructor(
    @InjectModel(BalanceAction.name)
    private readonly balanceActionModel: Model<BalanceActionDocument>,
    @InjectConnection('DATA_DB')
    private readonly connection: mongoose.Connection,
    private readonly keywordService: KeywordService,
    private readonly logService: LogService,
  ) {}

  async findAll(): Promise<BalanceAction[]> {
    return await this.balanceActionModel
      .find()
      .populate('user')
      .populate('phrases')
      .populate('expenseTypes')
      .exec();
  }

  async create(action: BalanceActionDTO, user: UserDocument) {
    this.logService.log({
      LOG_LEVEL: LOG_LEVEL.INFO,
      MESSAGE: 'CREATING LOG ACTION',
      body: { action, user },
    });
    const result = await this.balanceActionModel.create({
      ...action,
      user: user,
    });
    this.logService.log({
      LOG_LEVEL: LOG_LEVEL.INFO,
      MESSAGE: 'LOG_ACTION_CREATED',
      body: { action, user },
    });
    return result.toJSON();
  }

  async getByUser(user: UserDocument): Promise<BalanceActionDocument[]> {
    const expenseItemByUser = await this.balanceActionModel
      .find({ user })
      .populate('user')
      .populate('phrases')
      .populate('expenseTypes')
      .exec();
    return expenseItemByUser;
  }
  //read this https://stackoverflow.com/questions/41356669/how-can-i-aggregate-nested-documents
  async groupExpenses(user: UserDocument) {
    // const groupedResult: { [key: string]: number } = {};
    // const groupedExpenses = await this.balanceActionModel
    //   .find({ user })
    //   .then((data) => {
    //     for (const expense of data) {
    //       const { expenseTypes } = expense;
    //       for (const type of expenseTypes) {
    // 		groupedResult[type.name] =
    //       }
    //     }
    //   });
  }

  async creteBalanceAction(action: BalanceActionDTO, userId: string) {
    const transactionSession = await this.connection.startSession();
    this.logService.log({
      LOG_LEVEL: LOG_LEVEL.INFO,
      MESSAGE: 'TRANSACTION STARTED',
      body: { action, userId },
    });
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
      const result = await transactionSession.commitTransaction();
      this.logService.log({
        LOG_LEVEL: LOG_LEVEL.INFO,
        MESSAGE: 'TRANSACTION ENDED',
        body: { action, userId },
      });
      return result;
    } catch (error) {
      this.logService.log({
        LOG_LEVEL: LOG_LEVEL.ERROR,
        MESSAGE: 'BALANCE_ACTION_FAILED',
        body: { action, userId },
      });
      transactionSession.abortTransaction();
      return error;
    } finally {
      transactionSession.endSession();
    }
  }
}
