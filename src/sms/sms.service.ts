import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BalanceActionService } from 'src/balance-action/balance-action.service';
import { BalanceAction } from 'src/balance-action/schema/balance-action.schema';
import { SmsDTO } from 'src/dto/Sms/sms.dto';
import { User } from 'src/user/schema/user.schema';
import { SmsInfo, SmsInfoDocument } from './schema/sms.schema';

@Injectable()
export class SmsService {
  constructor(
    @InjectModel(SmsInfo.name)
    private readonly smsModel: Model<SmsInfoDocument>,
    private readonly balanceAction: BalanceActionService,
  ) {}
  private readonly NOT_APLICABLE: string = 'NOT_APLICABLE';
  async getForUser(user: User): Promise<SmsInfo[]> {
    return await this.smsModel.find({ user }).exec();
  }

  async smsReceived(sms: SmsDTO, user: User) {
    return await this._createBalanceItem(sms, user);
  }

  checkForKeywords(
    rawSms: string,
    smsWords: string[],
    balanceItems: BalanceAction[],
  ) {
    const blueprintResult = {
      keywords: [],
      amount: null,
      incoming: null, //can be true or false;
    };
    for (const balanceItem of balanceItems) {
      const { phrases } = balanceItem;
      for (const phrase of phrases) {
        const { name } = phrase;
        if (smsWords.indexOf(name) === -1) {
          continue;
        } else {
          blueprintResult.keywords.push(name);
          if (blueprintResult.keywords.length === phrases.length) {
            //this should mean that is done
            blueprintResult.incoming =
              balanceItem.phrasesInfluence === 'INBOUND';
            //findAmount - same logic as in the app;
            blueprintResult.amount = rawSms.slice(
              rawSms.indexOf(balanceItem.amountLocators[0]) +
                1 +
                balanceItem.amountLocators[0].length,
              rawSms.indexOf(balanceItem.amountLocators[1]),
            );
            return blueprintResult;
          } else {
            continue;
          }
        }
      }
    }
    throw this.NOT_APLICABLE;
  }

  async _createBalanceItem(smsData: SmsDTO, user: User) {
    const balanceItems: BalanceAction[] = await this.balanceAction.getByUser(
      user,
    );
    const words: string[] = smsData.content
      .replace(/([ .,;:]+)/g, '$1§sep§')
      .split('§sep§') //to words
      .map((w) => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')) //strip punctuation signs
      .map((w) => w.trim()); //whitespace
    let blueprintResult = null;

    try {
      blueprintResult = this.checkForKeywords(
        smsData.content,
        words,
        balanceItems,
      );
    } catch (error) {
      if (error === this.NOT_APLICABLE) {
        console.log('Current sms does not meet the requirements');
        return Promise.resolve();
      } else {
        console.log('Check for keywords failed', error);
        return Promise.resolve();
      }
    }

    if (blueprintResult === null) {
      console.log('This should not happen');
    } else {
      console.table(blueprintResult);
    }
    return Promise.resolve();
  }
}
