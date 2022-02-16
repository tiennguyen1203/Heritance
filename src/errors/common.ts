import { NextFunction, Request, Response } from 'express';

export interface CommonErrorResponse {
  message: string;
}

export abstract class CommonError extends Error {
  constructor(message: string) {
    super(message);

    // Just because we are extending a built in class
    Object.setPrototypeOf(this, CommonError.prototype);
  }
  abstract statusCode: number;
  abstract serializeErrors(): CommonErrorResponse;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  if (err instanceof CommonError) {
    return res.status(err.statusCode).send(err.serializeErrors());
  }
  console.error('An error has occurred', err);

  const formattedError: CommonErrorResponse = {
    message: 'An error has occurred',
  };

  return res.status(500).send(formattedError);
};
