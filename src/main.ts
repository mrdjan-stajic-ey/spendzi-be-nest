import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/MongoEnxceptionFilter';
import { ConfigService } from '@nestjs/config';
import { LogService } from './log/log.service';
declare const module: any;

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logService = app.get(LogService);
  const APP_PORT = configService.get<string>('APP_PORT');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  process.on('uncaughtException', (err) => {
    console.log('Uncaught exception', err);
    logService.unhandledException(err);
  });

  process.on('unhandledRejection', (err) => {
    console.log('Uncaught promise rejection', err);
    logService.unhandledPromiseReject(err);
  });

  await app.listen(APP_PORT || 80); //80 is used in the docker container that will not have a env variable so it defaults to 80

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
};
bootstrap();
