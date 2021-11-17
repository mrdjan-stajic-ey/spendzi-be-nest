import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from 'src/log/log.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logservice: LogService) {}
  use(req: Request, res: Response, next: NextFunction) {
    // this.logservice.helloWorld();
    console.log('Backend serviec hit');
    next();
  }
}
