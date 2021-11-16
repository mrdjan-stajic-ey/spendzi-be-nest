import { Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [LogModule],
})
export class LogMiddlewareModule {}
