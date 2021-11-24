import { IsNotEmpty } from 'class-validator';
import { KeywordInfluence } from 'src/keyword/schema/keyword.schema';

export interface IBalanceActionDTO {
  phrasesInfluence: KeywordInfluence;
  amount: number;
  phrases: string[];
  expenseTypes: string[];
  amountLocators: [string, string];
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
  @IsNotEmpty()
  amountLocators: [string, string];
}
