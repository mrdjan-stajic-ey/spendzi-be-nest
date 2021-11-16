import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './schema/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Log.name, schema: LogSchema }],
      'LOG_DB',
    ),
  ],
  providers: [LogService],
  controllers: [LogController],
  exports: [LogService],
})
export class LogModule {}
