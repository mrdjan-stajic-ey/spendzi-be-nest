import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CurrentUserInterceptor,
  IAppUserRequestInfo,
} from 'src/decorators/current.user';
import { KeywordDTO } from 'src/dto/keywords/keyword.dto';
import { LogService } from 'src/log/log.service';
import { LOG_LEVEL } from 'src/log/schema/log.schema';
import { KeywordService } from './keyword.service';

@Controller('keyword')
export class KeywordController {
  constructor(
    private readonly keywordService: KeywordService,
    private readonly logservice: LogService,
  ) {}

  @Get()
  async findAll(@Res() response: Response) {
    try {
      const result = await this.keywordService.findAll();
      response.status(HttpStatus.OK).send(result);
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).send(error);
      this.logservice.log({
        LOG_LEVEL: LOG_LEVEL.ERROR,
        MESSAGE: 'FAILED TO GET KEYWORDS',
        body: { error },
      });
    }
  }

  @UseInterceptors(CurrentUserInterceptor)
  @Post('/create')
  async newKeyword(
    @Body() keyword: KeywordDTO,
    @Res() res: Response,
    @Request() req: IAppUserRequestInfo,
  ) {
    try {
      const _keyword = await this.keywordService.create(
        keyword,
        req.currentUser._id,
      );
      res.status(HttpStatus.OK).send(_keyword);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
      this.logservice.log({
        LOG_LEVEL: LOG_LEVEL.ERROR,
        MESSAGE: 'FAILED TO GET KEYWORDS',
        body: { error },
      });
    }
  }
}
