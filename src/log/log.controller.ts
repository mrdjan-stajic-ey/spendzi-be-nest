import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';
import { Log } from './schema/log.schema';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async findAll(): Promise<Log[]> {
    return this.logService.findAll();
  }
}
