import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrentUserInterceptor } from 'src/decorators/current.user';
import { ExpenseModule } from 'src/expense/expense.module';
import { KeywordModule } from 'src/keyword/keyword.module';
import { LogModule } from 'src/log/log.module';
import { UserModule } from 'src/user/user.module';
import { BalanceActionController } from './balance-action.controller';
import { BalanceActionService } from './balance-action.service';
import {
  BalanceAction,
  BalanceActionSchema,
} from './schema/balance-action.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: BalanceAction.name, schema: BalanceActionSchema }],
      'DATA_DB',
    ),
    KeywordModule,
    UserModule,
    ExpenseModule,
    LogModule,
  ],
  controllers: [BalanceActionController],
  providers: [BalanceActionService, CurrentUserInterceptor],
  exports: [BalanceActionService],
})
export class BalanceActionModule {}
