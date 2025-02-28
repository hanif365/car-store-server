import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../config';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await AuthService.loginUser(req.body);

  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 365, // 365 days
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successful',
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: { accessToken },
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  await AuthService.logoutUser();

  // console.log('Logout successful');

  // Clear refresh token cookie
  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
  };

  res.clearCookie('refreshToken', cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Logout successful',
    data: null,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
