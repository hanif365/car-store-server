"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = __importDefault(require("./order.model"));
const product_model_1 = __importDefault(require("../product/product.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = require("../../errors/AppError");
const user_model_1 = __importDefault(require("../user/user.model"));
const order_utils_1 = require("./order.utils");
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.user || !payload.user.userId) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Get user details for payment
        const userDetails = yield user_model_1.default.findById(payload.user.userId);
        if (!userDetails) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        let totalPrice = 0;
        // Process each item in the order
        for (const item of payload.items) {
            const product = yield product_model_1.default.findById(item.product);
            if (!product) {
                throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found');
            }
            if (product.stock < item.quantity) {
                throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Not enough stock available');
            }
            // Calculate total price for this item
            totalPrice += product.price * item.quantity;
            // Update product stock
            yield product_model_1.default.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }, { session, new: true });
        }
        // Create order
        const order = yield order_model_1.default.create([
            {
                user: payload.user.userId,
                items: payload.items,
                totalPrice,
                address: payload.address,
                contactNo: payload.contactNo,
                city: payload.city,
                paymentStatus: 'Pending',
                status: 'Pending',
                transaction: {},
            },
        ], { session });
        // Prepare payment payload with user details
        const shurjopayPayload = {
            amount: totalPrice,
            order_id: order[0]._id,
            currency: 'BDT',
            customer_name: userDetails.name,
            customer_address: payload.address,
            customer_email: userDetails.email,
            customer_phone: payload.contactNo,
            customer_city: payload.city,
            client_ip: payload.client_ip,
        };
        const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
        if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
            yield order[0].updateOne({
                transaction: {
                    id: payment.sp_order_id,
                    transactionStatus: payment.transactionStatus,
                },
            });
        }
        yield session.commitTransaction();
        return payment.checkout_url;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('order_id', order_id);
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    // console.log('verifiedPayment', verifiedPayment);
    if (verifiedPayment.length) {
        yield order_model_1.default.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            paymentStatus: verifiedPayment[0].bank_status == 'Success'
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
        });
    }
    return verifiedPayment;
});
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find(), query)
        .search(['status', 'paymentStatus'])
        .filter()
        .sort()
        .paginate();
    const result = yield orderQuery.modelQuery.populate([
        { path: 'user', select: '-__v' },
        { path: 'items.product', select: '-__v' },
    ]);
    // .populate('user', 'name email')
    // .populate('product', 'name price');
    const total = yield order_model_1.default.countDocuments(orderQuery.modelQuery.getQuery());
    return {
        data: result,
        meta: {
            page: Number(query.page) || 1,
            limit: Number(query.limit) || 10,
            total,
        },
    };
});
const getMyOrders = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find({ user: user.userId }), query)
        .search(['status', 'paymentStatus'])
        .filter()
        .sort()
        .paginate();
    const result = yield orderQuery.modelQuery.populate([
        { path: 'user', select: '-__v' },
        { path: 'items.product', select: '-__v' },
    ]);
    const total = yield order_model_1.default.countDocuments(orderQuery.modelQuery.getQuery());
    return {
        data: result,
        meta: {
            page: Number(query.page) || 1,
            limit: Number(query.limit) || 10,
            total,
        },
    };
});
const getSingleOrder = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default.findOne({ _id: id, user: user.userId }).populate([
        { path: 'user', select: '-__v' },
        { path: 'items.product', select: '-__v' },
    ]);
    if (!order) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
    }
    return order;
});
const updateOrderStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default.findById(id);
    if (!order) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
    }
    const result = yield order_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate([
        { path: 'user', select: '-__v' },
        { path: 'items.product', select: '-__v' },
    ]);
    return result;
});
exports.OrderService = {
    createOrder,
    verifyPayment,
    getAllOrders,
    getMyOrders,
    getSingleOrder,
    updateOrderStatus,
};
