import { Model } from 'mongoose';

export type TUserRole = 'user' | 'admin';

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isActive: boolean;
  passwordChangedAt?: Date;
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TChangePassword = {
  currentPassword: string;
  newPassword: string;
};

export interface TUserModel extends Model<TUser> {
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
}
