import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '../exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      error: exception.errorCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
