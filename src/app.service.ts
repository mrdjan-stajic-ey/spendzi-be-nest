import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { [key: string]: any } {
    return { msg: 'Hello LOL!' };
  }
}
