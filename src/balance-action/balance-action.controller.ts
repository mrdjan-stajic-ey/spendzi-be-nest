import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
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
import { BalanceActionDTO } from 'src/dto/balance/BalanceAction';
import { BalanceActionService } from './balance-action.service';
import { BalanceAction } from './schema/balance-action.schema';

@UseGuards(JwtAuthGuard)
@Controller('balance-action')
export class BalanceActionController {
  constructor(private balanceActionService: BalanceActionService) {}

  @Get()
  async findAll(): Promise<BalanceAction[]> {
    return this.balanceActionService.findAll();
  }

  @Post('/create')
  @UseInterceptors(CurrentUserInterceptor)
  async create(
    @Body() balanceAction: BalanceActionDTO,
    @Request() req: IAppUserRequestInfo,
    @Res() res: Response,
  ) {
    try {
      const _balance_action_type =
        await this.balanceActionService.creteBalanceAction(
          balanceAction,
          req.currentUser._id,
        );
      res.status(HttpStatus.OK).send({});
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }
}
