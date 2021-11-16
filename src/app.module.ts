import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeywordModule } from './keyword/keyword.module';
import { ExpenseModule } from './expense/expense.module';
import { LogModule } from './log/log.module';
import { AppDBconnection } from './consts';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/Log';
import { LogMiddlewareModule } from './middlewares/LogMiddlewareModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`, //TODO: make everything be ready from env file. cannot use env in this file, Imports like moongoose neds to be async for this https://stackoverflow.com/questions/63285055/nestjs-how-to-use-env-variables-in-main-app-module-file-for-database-connecti
    }),
    MongooseModule.forRoot(AppDBconnection.dbUri, {
      connectionName: AppDBconnection.dataDbConnectionName,
      dbName: AppDBconnection.dataDBname,
    }),
    MongooseModule.forRoot(AppDBconnection.dbUri, {
      connectionName: AppDBconnection.logDbConnectionName,
      dbName: AppDBconnection.logDBname,
    }),
    LogMiddlewareModule,
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
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
