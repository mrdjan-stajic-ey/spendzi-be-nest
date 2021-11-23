import { IsNotEmpty } from 'class-validator';
import { Keyword, KeywordInfluence } from 'src/keyword/schema/keyword.schema';

export interface IBalanceActionDTO {
  phrasesInfluence: KeywordInfluence;
  amount: number;
  phrases: Keyword[];
}

export class BalanceActionDTO implements IBalanceActionDTO {
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  phrasesInfluence: KeywordInfluence;
  @IsNotEmpty()
  phrases: Keyword[];
}
