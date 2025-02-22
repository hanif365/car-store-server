import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import User from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Check authorization header exists or not
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized Access');
    }

    // Verify token
    const decoded = jwt.verify(
      token.split(' ')[1],
      config.jwt_access_secret as string,
    ) as JwtPayload;

    // Check user exists or not
    const user = await User.findById(decoded.userId);
    
    console.log(user);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Check user is blocked or not
    if (user.isBlocked) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Your account has been blocked',
      );
    }

    // Check user have permission or not
    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
