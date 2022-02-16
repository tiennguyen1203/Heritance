import { CommonError, CommonErrorResponse } from './common';

export class BadRequestError extends CommonError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);

    // Assign serializeErrors method to error instance
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): CommonErrorResponse {
    return {
      message: this.message,
    };
  }
}
