import { IsNotEmpty } from 'class-validator';

export interface ISmsDto {
  caller: string;
  content: string;
  timestamp: string;
  isReviewd: boolean;
}

export class SmsDTO implements ISmsDto {
  @IsNotEmpty()
  caller: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  timestamp: string;
  isReviewd = false;
}
