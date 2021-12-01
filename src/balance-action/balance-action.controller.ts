import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
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
import { BalanceActionDTO } from 'src/dto/balance/balance.action.dto';
import { BalanceActionService } from './balance-action.service';
import { BalanceAction } from './schema/balance-action.schema';

@UseGuards(JwtAuthGuard)
@Controller('/balance-action')
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
      res.status(HttpStatus.OK).send(_balance_action_type);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Get('/user')
  @UseInterceptors(CurrentUserInterceptor)
  async getBalanceItemsForUser(
    @Req() request: IAppUserRequestInfo,
    @Res() response: Response,
  ) {
    const { currentUser } = request;
    try {
      const result = await this.balanceActionService.getByUser(currentUser);
      response.status(HttpStatus.OK).send(result);
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Get('/group-expenses')
  @UseInterceptors(CurrentUserInterceptor)
  async groupExpenses(
    @Req() request: IAppUserRequestInfo,
    @Res() response: Response,
  ) {
    // try {
    //   //This Is just wrong - faulty - not working as expected
    //   const { currentUser } = request;
    //   const result = await this.balanceActionService.getByUser(currentUser);
    //   const expenseAgg = {};
    //   for (const balanceAction of result) {
    //     const { expenseType } = balanceAction;
    //     for (const exType of expenseTypes) {
    //       expenseAgg[exType.name] = !!expenseAgg[exType.name]
    //         ? expenseAgg[exType.name] + balanceAction.amount
    //         : balanceAction.amount;
    //     }
    //   }
    //   response.status(HttpStatus.OK).send(expenseAgg);
    // } catch (error) {
    //   response.status(HttpStatus.BAD_REQUEST).send(error);
    // }
    return response.status(HttpStatus.OK).send({});
  }
}
