import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './user.model';
import { TUser, TChangePassword } from './user.interface';
import { AppError } from '../../errors/AppError';
import config from '../../config';

const updateUserStatus = async (id: string, payload: { isActive: boolean }) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Check if target user is an admin
  if (user.role === 'admin') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Admin status cannot be changed',
    );
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const changePassword = async (user: JwtPayload, payload: TChangePassword) => {
  const userData = await User.findById(user.userId).select('+password');
  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.currentPassword,
    userData.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Current password is incorrect',
    );
  }

  // Hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findByIdAndUpdate(
    user.userId,
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return null;
};

const updateProfile = async (user: JwtPayload, payload: Partial<TUser>) => {
  const { name, email } = payload;

  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== user.userId) {
      throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
    }
  }

  const result = await User.findByIdAndUpdate(
    user.userId,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const UserService = {
  updateUserStatus,
  changePassword,
  updateProfile,
};
