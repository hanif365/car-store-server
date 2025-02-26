import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { DashboardService } from './dashboard.service';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getDashboardStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getDashboardStats,
};
