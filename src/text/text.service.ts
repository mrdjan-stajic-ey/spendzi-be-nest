import { Injectable } from '@nestjs/common';
import { LogService } from 'src/log/log.service';
import { LOG_LEVEL } from 'src/log/schema/log.schema';
import { Guid } from 'src/util/main';

export interface ISmsContent {
  text: string;
  onlyUniques: boolean;
  removePunct: boolean;
}

export interface IAssumeAMountRequest {
  smsContent: string;
  prefixIndex: number;
  sufixIndex: number;
}
//#region regular expresions
const regexNoPunc = (msg: string) =>
  msg.replace(/([ .,;]+)/g, '$1§sep§').split('§sep§');
const regexDefault = (msg: string) =>
  msg.replace(/([ ]+)/g, '$1§sep§').split('§sep§'); //defaults to only space
//#endregion regular expresions
@Injectable()
export class TextService {
  constructor(private readonly logService: LogService) {}

  public splitByWords(
    sentence: string,
    onlyUniques = true,
    removePunctSigns = false,
  ): { text: string; id: any }[] {
    try {
      let words: string[] = [];
      if (removePunctSigns) {
        words = [...regexNoPunc(sentence)];
      } else {
        words = [...regexDefault(sentence)]; //dots and space default;
      }
      if (!onlyUniques) {
        return words.map((w) => {
          return {
            text: w.trim(),
            id: Guid.newGuid(),
          };
        });
      } else {
        const result = [];
        const wordMap: { [key: string]: number } = {};
        for (const word of words) {
          if (wordMap[word] !== 1) {
            result.push({ text: word.trim(), id: Guid.newGuid() });
            wordMap[word] = 1;
          }
        }
        this.logService.log({
          LOG_LEVEL: LOG_LEVEL.VERBOSE,
          MESSAGE: 'Message tokenized',
        });
        return result;
      }
    } catch (error) {
      this.logService.log({
        LOG_LEVEL: LOG_LEVEL.ERROR,
        MESSAGE: 'Failed parsing sms',
        body: {
          sentence,
          onlyUniques,
          removePunctSigns,
        },
      });
    }
  }

  public asumeAmount(sms: string, [prefix, sufix]: [number, number]): number {
    const words = this.splitByWords(sms, true);
    let prefixIndex = -1;
    let sufixIndex = -1;
    if (prefix < sufix) {
      prefixIndex = prefix; // sort the array
      sufixIndex = sufix;
    } else {
      prefixIndex = sufix;
      sufixIndex = prefix;
    }
    let predictedAmount = words.slice(prefixIndex + 1, sufixIndex)[0].text;
    //check for dots and commas;
    const decimals = predictedAmount.substr(-3);
    if (decimals[0] === '.') {
      predictedAmount = predictedAmount.replace(',', '');
    }
    return parseFloat(predictedAmount);
  }

  public assumeByMatchingStrings(
    sms: string,
    [prefix, sufix]: [string, string],
  ): number {
    const words = this.splitByWords(sms, true);
    const indexOfPrefix = words
      .map((w) => w.text.toLowerCase())
      .indexOf(prefix.toLowerCase());
    const indexOfSufix = words
      .map((w) => w.text.toLowerCase())
      .indexOf(sufix.toLowerCase());

    let predictedAmount = words.slice(indexOfPrefix + 1, indexOfSufix)[0].text;
    //check for dots and commas;
    const decimals = predictedAmount.substr(-3); // todo: generalize this operation
    if (decimals[0] === '.') {
      predictedAmount = predictedAmount.replace(',', '');
    }

    return parseFloat(predictedAmount);
  }
}
