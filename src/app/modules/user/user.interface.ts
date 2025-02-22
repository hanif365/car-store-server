import { Model } from "mongoose";

export type TUserRole = 'user' | 'admin';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isBlocked: boolean;
};

export type TUserModel = Model<TUser> & {
    isPasswordMatched(
      givenPassword: string,
      savedPassword: string,
    ): Promise<boolean>;
  };
