import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import { AppError } from '../../errors/AppError';
import User from '../user/user.model';
import {
  TLoginResponse,
  TLoginUser,
  TRegisterResponse,
  TRegisterUser,
  TLogoutResponse,
} from './auth.interface';
import { createToken } from './auth.utils';

const registerUser = async (
  payload: TRegisterUser,
): Promise<TRegisterResponse> => {
  // Check if user already exists
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(StatusCodes.CONFLICT, 'User already exists');
  }

  // Create user
  const user = await User.create(payload);

  // Return user without password field for security reasons
  const responseData: TRegisterResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  return responseData;
};

const loginUser = async (payload: TLoginUser): Promise<TLoginResponse> => {
  const { email, password } = payload;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not exist');
  }

  // Check if user is blocked
  if (user.isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account has been blocked');
  }

  // Check password is correct or not
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

//   console.log(user);

  const jwtPayload = {
    userId: user._id,
    role: user.role,
    // email: user.email,
  };

  // Generate token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (): Promise<TLogoutResponse> => {
  return {
    message: 'Logout successful',
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  logoutUser,
};
