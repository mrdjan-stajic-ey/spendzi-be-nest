import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Keyword, KeywordSchema } from './schema/keyword.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Keyword.name, schema: KeywordSchema }],
      'DATA_DB',
    ),
  ],
  providers: [KeywordService],
  controllers: [KeywordController],
})
export class KeywordModule {}
