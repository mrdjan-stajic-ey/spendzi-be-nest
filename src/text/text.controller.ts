import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { IAssumeAMountRequest, ISmsContent, TextService } from './text.service';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post('split')
  public splitSentence(@Body() body: ISmsContent, @Res() resp: Response) {
    return resp
      .status(HttpStatus.OK)
      .send(
        this.textService.splitByWords(
          body.text,
          body.onlyUniques,
          body.removePunct,
        ),
      );
  }

  @Post('assume-amount')
  public assumeAmount(
    @Body() body: IAssumeAMountRequest,
    @Res() resp: Response,
  ) {
    const result = this.textService.asumeAmount(body.smsContent, [
      body.prefixIndex,
      body.sufixIndex,
    ]);
    const [prefix, sufix] = this.textService.getPrefixAndSufix(
      body.smsContent,
      [body.prefixIndex, body.sufixIndex],
    );

    if (isNaN(result))
      return resp
        .status(HttpStatus.BAD_REQUEST)
        .send('Cannot parse, parsing result' + result);
    else {
      return resp.status(HttpStatus.OK).send({ amount: result, prefix, sufix });
    }
  }
}
