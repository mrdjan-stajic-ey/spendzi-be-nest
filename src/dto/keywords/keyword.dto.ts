import { IsEnum, IsNotEmpty } from 'class-validator';
import { KeywordInfluence } from 'src/keyword/schema/keyword.schema';

export interface IKeywordDTO {
  name: string;
  description?: string;
  keywordInfluence: KeywordInfluence;
  user: string;
}

export class KeywordDTO implements IKeywordDTO {
  @IsNotEmpty()
  name: string;
  description = '';
  @IsNotEmpty()
  @IsEnum(KeywordInfluence)
  keywordInfluence: KeywordInfluence;
  user: string;
}
