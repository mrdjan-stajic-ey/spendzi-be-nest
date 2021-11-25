import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BalanceActionService } from 'src/balance-action/balance-action.service';
import { BalanceActionDocument } from 'src/balance-action/schema/balance-action.schema';
import { SmsDTO } from 'src/dto/Sms/sms.dto';
import { KeywordInfluence } from 'src/keyword/schema/keyword.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';
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

  async smsReceived(sms: SmsDTO, user: UserDocument) {
    return await this._createBalanceItem(sms, user);
  }

  checkForKeywords(
    rawSms: string,
    smsWords: string[],
    balanceItems: BalanceActionDocument[],
  ) {
    const blueprintResult = {
      keywords: [],
      amount: null,
      incoming: null, //can be true or false;
      templateId: null,
    };
    for (const balanceItem of balanceItems) {
      debugger;
      console.log('BALANCE ITEM', balanceItem);
      const { phrases } = balanceItem;
      for (const phrase of phrases) {
        const { name } = phrase;
        if (smsWords.indexOf(name) === -1) {
          continue;
        } else {
          blueprintResult.keywords.push(name);
          if (blueprintResult.keywords.length === phrases.length) {
            //this should mean that is done
            blueprintResult.templateId = balanceItem.id;
            blueprintResult.incoming =
              balanceItem.phrasesInfluence === 'INBOUND';
            //findAmount - same logic as in the app;
            blueprintResult.amount = rawSms.slice(
              rawSms.indexOf(balanceItem.amountLocators[0]) +
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

  async _createBalanceItem(smsData: SmsDTO, user: UserDocument) {
    const balanceItems: BalanceActionDocument[] =
      await this.balanceAction.getByUser(user);
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
      try {
        const balanceItemToCopy = balanceItems.filter(
          (f) => f.id === blueprintResult.templateId,
        )[0];
        console.log(balanceItemToCopy.id);
        this.balanceAction.create(
          {
            amount: parseFloat(blueprintResult.amount.trim()),
            amountLocators: balanceItemToCopy.amountLocators,
            templateId: balanceItemToCopy.id,
            phrases: balanceItemToCopy.phrases.map((p) => p.id),
            expenseTypes: balanceItemToCopy.expenseTypes.map((et) => et.id),
            phrasesInfluence:
              balanceItemToCopy.phrasesInfluence == KeywordInfluence.INBOUND
                ? KeywordInfluence.INBOUND
                : KeywordInfluence.OUTBOUND,
            template: false,
          },
          user.id,
        );
      } catch (error) {
        console.log('FAIL', error);
      }
    }
    return Promise.resolve();
  }
}
