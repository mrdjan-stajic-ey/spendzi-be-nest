import { Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';
import { TextController } from './text.controller';
import { TextService } from './text.service';

@Module({
  imports: [LogModule],
  controllers: [TextController],
  providers: [TextService],
  exports: [TextService],
})
export class TextModule {}
