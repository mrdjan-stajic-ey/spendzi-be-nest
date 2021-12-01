import { IsNotEmpty } from 'class-validator';
import { KeywordInfluence } from 'src/keyword/schema/keyword.schema';

export interface IBalanceActionDTO {
  phrasesInfluence: KeywordInfluence;
  amount: string;
  phrases: string[];
  expenseType: string;
  amountLocators: [number, number];
  template?: boolean;
  templateId?: string;
}

export class BalanceActionDTO implements IBalanceActionDTO {
  @IsNotEmpty()
  amount: string;
  @IsNotEmpty()
  phrasesInfluence: KeywordInfluence;
  @IsNotEmpty()
  phrases: string[];
  @IsNotEmpty()
  expenseType: string;
  @IsNotEmpty()
  amountLocators: [number, number];
  template = false;
  templateId = '';
}
