import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BalanceActionService } from 'src/balance-action/balance-action.service';
import { BalanceActionDocument } from 'src/balance-action/schema/balance-action.schema';
import { SmsDTO } from 'src/dto/Sms/sms.dto';
import { KeywordInfluence } from 'src/keyword/schema/keyword.schema';
import { TextService } from 'src/text/text.service';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { SmsInfo, SmsInfoDocument } from './schema/sms.schema';

@Injectable()
export class SmsService {
  constructor(
    @InjectModel(SmsInfo.name)
    private readonly smsModel: Model<SmsInfoDocument>,
    private readonly balanceAction: BalanceActionService,
    private readonly textService: TextService,
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
    const blueprintResult: {
      keywords: string[];
      amount: number;
      incoming: boolean;
      templateId: string;
    } = {
      keywords: [],
      amount: null,
      incoming: null, //can be true or false;
      templateId: null,
    };
    for (const balanceItem of balanceItems) {
      const { phrases } = balanceItem;
      for (const phrase of phrases) {
        const { name } = phrase;
        const comparableName = name.toLowerCase().trim();
        if (smsWords.indexOf(comparableName) === -1) {
          blueprintResult.keywords = [];
          continue;
        } else {
          blueprintResult.keywords.push(name);
          if (blueprintResult.keywords.length === phrases.length) {
            blueprintResult.templateId = balanceItem.id;
            (blueprintResult.incoming =
              balanceItem.phrasesInfluence === 'INBOUND'),
              (blueprintResult.amount = this.textService.asumeAmount(rawSms, [
                balanceItem.amountLocators[0],
                balanceItem.amountLocators[1],
              ]));
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
      await this.balanceAction.getTemplates(user);
    debugger;
    const words: string[] = this.textService
      .splitByWords(smsData.content, true, false)
      .map((w) => w.text.toLowerCase());
    let blueprintResult = null;
    const sms_content_toLower = smsData.content.toLowerCase(); // we keep the raw sms in lowercase because the amount is extracted here; //we need unique words here only;!!!!!!!!!!!!!!!!!!!!!!!!!
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
        console.log('Cz`heck for keywords failed', error);
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
            amount: blueprintResult.amount,
            amountLocators: balanceItemToCopy.amountLocators,
            templateId: blueprintResult.templateId,
            phrases: balanceItemToCopy.phrases.map((p) => p.id),
            expenseType: balanceItemToCopy.expenseType.id,
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
