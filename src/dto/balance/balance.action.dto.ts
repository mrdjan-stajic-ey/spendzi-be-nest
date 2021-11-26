import { IsNotEmpty } from 'class-validator';
import { KeywordInfluence } from 'src/keyword/schema/keyword.schema';

export interface IBalanceActionDTO {
  phrasesInfluence: KeywordInfluence;
  amount: string;
  phrases: string[];
  expenseTypes: string[];
  amountLocators: string[];
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
  expenseTypes: string[];
  @IsNotEmpty()
  amountLocators: string[];
  template = false;
  templateId = '';
}
