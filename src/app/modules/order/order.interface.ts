import { Types } from 'mongoose';

export type TOrder = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  estimatedDeliveryDate?: Date;
  paymentStatus: 'Pending' | 'Paid';
  paymentMethod: string;
  address: string;
  contactNo: string;
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
