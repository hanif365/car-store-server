import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

type TSendResponse<T> = {
  statusCode: StatusCodes;
  success: boolean;
  message?: string | null;
  data?: T;
};

const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    statusCode: data.statusCode,
    data: data.data,
  });
};

export default sendResponse;
