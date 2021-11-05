import { Controller, Get } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Expense } from './schema/expense.schema';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  async findAll(): Promise<Expense[]> {
    return this.expenseService.findAll();
  }
}
