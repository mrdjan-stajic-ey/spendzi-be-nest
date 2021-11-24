import { IsNotEmpty } from 'class-validator';
import { Expense } from 'src/expense/schema/expense.schema';
import { Keyword, KeywordInfluence } from 'src/keyword/schema/keyword.schema';

export interface IBalanceActionDTO {
  phrasesInfluence: KeywordInfluence;
  amount: number;
  phrases: string[];
  expenseTypes: string[];
}

export class BalanceActionDTO implements IBalanceActionDTO {
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  phrasesInfluence: KeywordInfluence;
  @IsNotEmpty()
  phrases: string[];
  @IsNotEmpty()
  expenseTypes: string[];
}
