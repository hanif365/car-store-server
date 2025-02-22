import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Order from './order.model';
import Product from '../product/product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../errors/AppError';
import { TOrder } from './order.interface';

const createOrder = async (payload: TOrder, user: JwtPayload) => {
  // Start transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Check if product exists and has enough stock
    const product = await Product.findById(payload.product);
    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    if (product.stock < payload.quantity) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Not enough stock available');
    }

    // Calculate total price
    payload.totalPrice = product.price * payload.quantity;
    payload.user = user.userId;

    // Create order
    const order = await Order.create([payload], { session });

    // Update product stock
    await Product.findByIdAndUpdate(
      payload.product,
      { $inc: { stock: -payload.quantity } },
      { session, new: true },
    );

    await session.commitTransaction();

    // Use await and specify fields to populate
    const populatedOrder = await order[0].populate([
      { path: 'user', select: '-__v' },
      { path: 'product', select: '-__v' },
    ]);

    return populatedOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find(), query)
    .search(['status', 'paymentStatus'])
    .filter()
    .sort()
    .paginate();

  const result = await orderQuery.modelQuery.populate([
    { path: 'user', select: '-__v' },
    { path: 'product', select: '-__v' },
  ]);
  // .populate('user', 'name email')
  // .populate('product', 'name price');

  const total = await Order.countDocuments(orderQuery.modelQuery.getQuery());

  return {
    data: result,
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
  };
};

const getMyOrders = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const orderQuery = new QueryBuilder(Order.find({ user: user.userId }), query)
    .search(['status', 'paymentStatus'])
    .filter()
    .sort()
    .paginate();

  const result = await orderQuery.modelQuery.populate([
    { path: 'user', select: '-__v' },
    { path: 'product', select: '-__v' },
  ]);
  const total = await Order.countDocuments(orderQuery.modelQuery.getQuery());

  return {
    data: result,
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
  };
};

const getSingleOrder = async (id: string, user: JwtPayload) => {
  const order = await Order.findOne({ _id: id, user: user.userId }).populate([
    { path: 'user', select: '-__v' },
    { path: 'product', select: '-__v' },
  ]);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  return order;
};

const updateOrderStatus = async (
  id: string,
  payload: {
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
    estimatedDeliveryDate?: Date;
  },
) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  const result = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate([
    { path: 'user', select: '-__v' },
    { path: 'product', select: '-__v' },
  ]);

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
};
