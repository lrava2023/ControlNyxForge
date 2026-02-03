import { HttpException, HttpStatus } from '@nestjs/common';
import { DomainErrorCode } from '../enums/domain-error-code.enum';

export class DomainException extends HttpException {
  constructor(
    public readonly errorCode: DomainErrorCode,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}

export { DomainErrorCode };
