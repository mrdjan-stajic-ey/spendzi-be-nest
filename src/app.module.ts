import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import {
  MongooseModule,
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeywordModule } from './keyword/keyword.module';
import { ExpenseModule } from './expense/expense.module';
import { LogModule } from './log/log.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/Log';
import { LogMiddlewareModule } from './middlewares/LogMiddlewareModule';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'DATA_DB',
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>(
          'DB_USERNAME',
        )}:${configService.get<string>(
          'DB_PASSWORD',
        )}${configService.get<string>('DB_URI_PORT_CONNECTION')}`,
        dbName: 'spendzi-mongo-db',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'LOG_DB',
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>(
          'DB_USERNAME',
        )}:${configService.get<string>(
          'DB_PASSWORD',
        )}${configService.get<string>('DB_URI_PORT_CONNECTION')}`,
        dbName: 'spendzi-log-db',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    LogMiddlewareModule,
    KeywordModule,
    ExpenseModule,
    LogModule,
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
