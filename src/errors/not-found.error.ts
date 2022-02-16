import { CommonError, CommonErrorResponse } from './common';

export class NotFoundError extends CommonError {
  statusCode = 404;
  constructor(public message: string) {
    super(message);

    // Assign serializeErrors method to error instance
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): CommonErrorResponse {
    return {
      message: this.message,
    };
  }
}
