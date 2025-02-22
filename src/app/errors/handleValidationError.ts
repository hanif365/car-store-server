import mongoose from 'mongoose';
import { TErrorDetails } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorDetails: TErrorDetails = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: val?.path,
      details: val?.message,
    }),
  );

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Validation Error',
    errorDetails,
  };
};

export default handleValidationError;
