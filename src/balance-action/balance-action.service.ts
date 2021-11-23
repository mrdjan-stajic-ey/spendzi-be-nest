import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BalanceActionDTO } from 'src/dto/balance/BalanceAction';
import {
  BalanceAction,
  BalanceActionDocument,
} from './schema/balance-action.schema';

@Injectable()
export class BalanceActionService {
  constructor(
    @InjectModel(BalanceAction.name)
    private readonly balanceActionModel: Model<BalanceActionDocument>,
  ) {}

  async findAll(): Promise<BalanceAction[]> {
    return await this.balanceActionModel
      .find()
      .populate('user')
      .populate({ path: 'phrases', populate: { path: 'expenseTypes' } })
      .exec();
  }

  async create(action: BalanceActionDTO, userId: string) {
    return await this.balanceActionModel.create({ ...action, user: userId });
  }
}
