import { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Order from './order.model';
import Product from '../product/product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { AppError } from '../../errors/AppError';
import { TOrder } from './order.interface';
import User from '../user/user.model';
import { orderUtils } from './order.utils';

const createOrder = async (
  payload: TOrder,
  user: JwtPayload,
  client_ip: string,
) => {
  // Start transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Get user details for payment
    const userDetails = await User.findById(user.userId);
    if (!userDetails) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

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

    // console.log('order', order);

    // console.log('payload', payload);

    // console.log('user', user);

    // Update product stock
    await Product.findByIdAndUpdate(
      payload.product,
      { $inc: { stock: -payload.quantity } },
      { session, new: true },
    );

    // Prepare payment payload with user details
    const shurjopayPayload = {
      amount: payload.totalPrice,
      order_id: order[0]._id,
      currency: 'BDT',
      customer_name: userDetails.name,
      customer_address: payload.address,
      customer_email: userDetails.email,
      customer_phone: payload.contactNo,
      customer_city: payload.city,
      client_ip,
    };

    // console.log('shurjopayPayload', shurjopayPayload);

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    // console.log('payment', payment);

    if (payment?.transactionStatus) {
      await order[0].updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      });
    }

    await session.commitTransaction();

    // Use await and specify fields to populate
    const populatedOrder = await order[0].populate([
      { path: 'user', select: '-__v' },
      { path: 'product', select: '-__v' },
    ]);

    return { order: populatedOrder, payment: payment.checkout_url };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const verifyPayment = async (order_id: string) => {
  // console.log('order_id', order_id);
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  // console.log('verifiedPayment', verifiedPayment);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        paymentStatus:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',

        // status:
        //   verifiedPayment[0].bank_status == "Success"
        //     ? "Processing"
        //     : verifiedPayment[0].bank_status == "Failed"
        //     ? "Pending"
        //     : verifiedPayment[0].bank_status == "Cancel"
        //     ? "Cancelled"
        //     : "",
      },
    );
  }

  return verifiedPayment;
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
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
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
  verifyPayment,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
};
