import { ZodError, ZodIssue } from 'zod';
import { TErrorDetails, TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorDetails: TErrorDetails = err.issues.map((issue: ZodIssue) => ({
    path: issue?.path[issue.path.length - 1],
    details: issue?.message,
  }));

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Validation Error',
    errorDetails,
  };
};

export default handleZodError;
