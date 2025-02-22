/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../errors/AppError';
import { TProduct } from './product.interface';
import Product from './product.model';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';

const createProduct = async (payload: TProduct, user: JwtPayload) => {
  payload.createdBy = user.userId;
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find({ isDeleted: false }), query)
    .search(['name', 'brand', 'category', 'model'])
    .filter()
    .sort()
    .paginate();

  const result = await productQuery.modelQuery.populate('createdBy', 'name email');
  const total = await Product.countDocuments(productQuery.modelQuery.getQuery());

  return {
    data: result,
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total
    }
  };
};

const getSingleProduct = async (id: string) => {
  const product = await Product.findOne({ _id: id, isDeleted: false }).populate('createdBy', 'name email');
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  return product;
};

const updateProduct = async (id: string, payload: Partial<TProduct>) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProduct = async (id: string) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
