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

  //ovo treba da se razbije na mnogo funkcija
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
      const { phrases } = balanceItem;
      for (const phrase of phrases) {
        const { name } = phrase;
        if (smsWords.indexOf(name.toLocaleLowerCase()) === -1) {
          continue;
        } else {
          blueprintResult.keywords.push(name);
          if (blueprintResult.keywords.length === phrases.length) {
            debugger;
            //this should mean that is done
            const preparedPrefix = balanceItem.amountLocators[0]
              .toLowerCase()
              .replace(/([ :]+)/g, '$1§sep§'); // duplikacija koda, boli me uvo
            const preparedSufix = balanceItem.amountLocators[1]
              .toLowerCase()
              .replace(/([ :]+)/g, '$1§sep§');
            const amountString = rawSms
              .slice(
                rawSms.indexOf(preparedPrefix) + preparedPrefix.length,
                rawSms.indexOf(preparedSufix),
              )
              .replace(/[^0-9\.,]/g, ''); //zarezi odvajaju hiljade (to skloniti) tacke odvajau decimale, to nakalemiti kasnije // sacuvati decimale i dodati kasnije

            blueprintResult.templateId = balanceItem.id;
            (blueprintResult.incoming =
              balanceItem.phrasesInfluence === 'INBOUND'),
              //findAmount - same logic as in the app;
              (blueprintResult.amount = rawSms.slice(
                rawSms.indexOf(preparedPrefix) + preparedPrefix.length,
                rawSms.indexOf(preparedSufix),
              ));
            return blueprintResult;
          } else {
            continue;
          }
        }
      }
    }
    throw this.NOT_APLICABLE;
  }
  /**
   * This is not a way you handle substrings and sub arrays i dont know algorithms //slow as fuck
   * first mega regex for words is to strip them of punctaction and make them lowercase and make an array of them
   * @param smsData
   * @param user
   * @returns
   */
  async _createBalanceItem(smsData: SmsDTO, user: UserDocument) {
    const balanceItems: BalanceActionDocument[] =
      await this.balanceAction.getByUser(user);
    const words: string[] = smsData.content
      .replace(/([ .,;:]+)/g, '$1§sep§')
      .split('§sep§') //to words
      .map((w) => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')) //strip punctuation signs
      .map((w) => w.trim()) //whitespace
      .map((w) => w.toLowerCase()); //loweracse shit
    let blueprintResult = null;
    const sms_content_toLower = smsData.content.toLowerCase(); // we keep the raw sms in lowercase because the amount is extracted here;
    try {
      blueprintResult = this.checkForKeywords(
        sms_content_toLower,
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
        await this.balanceAction.create(
          {
            amount: blueprintResult.amount //TODO: fix it per sms`s you sent yourself
              .trim()
              .replace(',', '')
              .replace('.', '')
              .trim(), //TODO this needs to be revised
            amountLocators: balanceItemToCopy.amountLocators,
            templateId: blueprintResult.id,
            phrases: balanceItemToCopy.phrases.map((p) => p.id),
            expenseTypes: balanceItemToCopy.expenseTypes.map((et) => et.id),
            phrasesInfluence:
              balanceItemToCopy.phrasesInfluence == KeywordInfluence.INBOUND
                ? KeywordInfluence.INBOUND
                : KeywordInfluence.OUTBOUND,
            template: false,
          },
          user,
        );
      } catch (error) {
        console.log('FAIL', error);
      }
    }
    return Promise.resolve();
  }
}
