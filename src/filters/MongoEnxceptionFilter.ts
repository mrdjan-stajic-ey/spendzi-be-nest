import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
// import { Error } from 'mongoose';
// import ValidationError = Error.ValidationError;

// @Catch(ValidationError)
// export class ValidationErrorFilter implements ExceptionFilter {
//   catch(exception: ValidationError, host: ArgumentsHost): any {
//     console.log('AAAAAAAAAAAA', host, exception);
//     const ctx = host.switchToHttp(),
//       response = ctx.getResponse();

//     return response.status(400).json({
//       statusCode: 400,
//       createdBy: 'MonggoValidationError',
//       errors: exception.errors,
//     });
//   }
// }

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
