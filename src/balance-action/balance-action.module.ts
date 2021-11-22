import { Module } from '@nestjs/common';
import { BalanceActionController } from './balance-action.controller';
import { BalanceActionService } from './balance-action.service';

@Module({
  controllers: [BalanceActionController],
  providers: [BalanceActionService],
})
export class BalanceActionModule {}
