import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LogService } from './log.service';
import { Log } from './schema/log.schema';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async findAll(): Promise<Log[]> {
    return this.logService.findAll();
  }

  @Post()
  async logEvent(
    @Body() logBody: { log: string; data: Record<string, any> },
    @Res() res: Response,
  ) {
    console.log(`LOG ${logBody.log}`);
    console.table(logBody.data);
    res.status(HttpStatus.OK).send(true);
  }
}
