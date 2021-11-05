import { Controller, Get } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { Keyword } from './schema/keyword.schema';

@Controller('keyword')
export class KeywordController {
  constructor(private keywordService: KeywordService) {}

  @Get()
  async findAll(): Promise<Keyword[]> {
    return this.keywordService.findAll();
  }
}
