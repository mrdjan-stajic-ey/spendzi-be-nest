import { IsNotEmpty } from 'class-validator';
export interface IKeywordDTO {
  name: string;
  description?: string;
}

export class KeywordDTO implements IKeywordDTO {
  @IsNotEmpty()
  name: string;
  description = '';
}
