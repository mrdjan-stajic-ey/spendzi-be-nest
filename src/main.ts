import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/MongoEnxceptionFilter';
// import { AllExceptionsFilter } from './filters/MongoEnxceptionFilter';
declare const module: any;

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  //   app.useGlobalFilters(new MongoExceptionFilter()); //i dont know why this is not working
  //   app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
};
bootstrap();
