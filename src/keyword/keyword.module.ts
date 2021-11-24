import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Keyword, KeywordSchema } from './schema/keyword.schema';
import { UserModule } from 'src/user/user.module';
import { CurrentUserInterceptor } from 'src/decorators/current.user';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Keyword.name, schema: KeywordSchema }],
      'DATA_DB',
    ),
    UserModule,
    LogModule,
  ],
  providers: [KeywordService, CurrentUserInterceptor],
  controllers: [KeywordController],
  exports: [KeywordService],
})
export class KeywordModule {}
