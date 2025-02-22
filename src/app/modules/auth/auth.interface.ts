import { Types } from 'mongoose';

export type TLoginUser = {
  email: string;
  password: string;
};

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type TRegisterResponse = {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  //   role: string;
};

export type TLogoutResponse = {
  message: string;
};
