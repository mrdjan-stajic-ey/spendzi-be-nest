import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { KeywordDTO } from 'src/dto/keywords/keyword.dto';
import { KeywordService } from './keyword.service';
import { Keyword } from './schema/keyword.schema';

@Controller('keyword')
export class KeywordController {
  constructor(private keywordService: KeywordService) {}

  @Get()
  async findAll(): Promise<Keyword[]> {
    return this.keywordService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async newKeyword(@Body() keyword: KeywordDTO, @Res() res: Response) {
    try {
      const _keyword = await this.keywordService.create(keyword);
      res.status(HttpStatus.OK).send(_keyword);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }
}
