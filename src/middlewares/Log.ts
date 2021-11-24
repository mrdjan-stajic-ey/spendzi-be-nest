import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from 'src/log/log.service';
import { LOG_LEVEL } from 'src/log/schema/log.schema';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logservice: LogService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logservice.log({
      LOG_LEVEL: LOG_LEVEL.VERBOSE,
      MESSAGE: 'server  hit',
      body: {
        baseUrl: req.baseUrl,
        method: req.method,
        body: JSON.stringify(req.body),
      },
    });
    next();
  }
}
