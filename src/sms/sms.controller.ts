import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CurrentUserInterceptor,
  IAppUserRequestInfo,
} from 'src/decorators/current.user';
import { SmsDTO } from 'src/dto/Sms/sms.dto';
import { SmsService } from './sms.service';

@UseGuards(JwtAuthGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Get()
  @UseInterceptors(CurrentUserInterceptor)
  async findByUser(@Req() req: IAppUserRequestInfo, @Res() resp: Response) {
    const { currentUser } = req;
    try {
      const msgs = await this.smsService.getForUser(currentUser);
      resp.status(HttpStatus.OK).send(msgs);
    } catch (error) {
      resp.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Post()
  @UseInterceptors(CurrentUserInterceptor)
  async saveMsg(
    @Body() sms: SmsDTO,
    @Res() resp: Response,
    @Req() req: IAppUserRequestInfo,
  ) {
    try {
      debugger;
      const result = await this.smsService.smsReceived(sms, req.currentUser);
      resp.status(HttpStatus.OK).send(result);
    } catch (error) {
      resp.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }
}
