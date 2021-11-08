import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeywordModule } from './keyword/keyword.module';
import { ExpenseModule } from './expense/expense.module';
import { LogModule } from './log/log.module';
import { AppDBconnection } from './consts';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(AppDBconnection.dbUri, {
      connectionName: AppDBconnection.dataDbConnectionName,
      dbName: AppDBconnection.dataDBname,
    }),
    MongooseModule.forRoot(AppDBconnection.dbUri, {
      connectionName: AppDBconnection.logDbConnectionName,
      dbName: AppDBconnection.logDBname,
    }),
    KeywordModule,
    ExpenseModule,
    LogModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
