import { Types } from 'mongoose';

export type TTransaction = {
  id: string;
  transactionStatus: string;
  bank_status: string;
  sp_code: string;
  sp_message: string;
  method: string;
  date_time: string;
};

export type TOrderItem = {
  product: Types.ObjectId;
  quantity: number;
};

export type TOrder = {
  user: Types.ObjectId;
  items: TOrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  estimatedDeliveryDate?: Date;
  paymentStatus: 'Pending' | 'Paid' | 'Cancelled';
  address: string;
  contactNo: string;
  city: string;
  transaction: TTransaction;
};

export type TOrderFilters = {
  searchTerm?: string;
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
