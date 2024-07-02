import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoDBExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 11000 || exception.code === 11001) {
      return response.status(409).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Conflict - Duplicate Key Error',
        error: exception.errmsg,
      });
    }
  }
}
