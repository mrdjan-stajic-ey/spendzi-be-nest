import { IsNotEmpty } from 'class-validator';
//TODO: Keyword is a phrase list of words asociated with Expanse type :Food, Transpo, bla bla;
export interface IKeywordDTO {
  name: string;
  description?: string;
  user: string;
}

export class KeywordDTO implements IKeywordDTO {
  @IsNotEmpty()
  name: string;
  description = '';
  @IsNotEmpty()
  user: string;
  @IsNotEmpty()
  expenseTypes: [string];
}
