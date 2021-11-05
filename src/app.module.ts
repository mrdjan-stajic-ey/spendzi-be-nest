import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeywordModule } from './keyword/keyword.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://mrdjaney:smederevo026@localhost:27888/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
      {
        dbName: 'spendzi-mongo-db',
      },
    ),
    KeywordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
