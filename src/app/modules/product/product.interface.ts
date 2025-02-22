import { Types } from 'mongoose';

export type TProduct = {
  name: string;
  brand: string;
  model: string;
  yearOfManufacture: number;
  price: number;
  category: string;
  stock: number;
  description: string;
  image: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
};

export type TProductFilters = {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  category?: string;
  model?: string;
  yearOfManufacture?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
