import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrentUserInterceptor } from 'src/decorators/current.user';
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
    UserModule,
  ],
  controllers: [BalanceActionController],
  providers: [BalanceActionService, CurrentUserInterceptor],
})
export class BalanceActionModule {}
