import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrentUserInterceptor } from 'src/decorators/current.user';
import { UserModule } from 'src/user/user.module';
import { SmsInfo, SmsInfoSchema } from './schema/sms.schema';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SmsInfo.name, schema: SmsInfoSchema }],
      'DATA_DB',
    ),
    UserModule,
  ],
  controllers: [SmsController],
  providers: [SmsService, CurrentUserInterceptor],
  exports: [SmsService],
})
export class SmsModule {}
