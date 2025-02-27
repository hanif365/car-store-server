"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    estimatedDeliveryDate: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Cancelled'],
        default: 'Pending',
    },
    // paymentMethod: {
    //   type: String,
    //   required: true,
    // },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    transaction: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
}, {
    timestamps: true,
});
const Order = (0, mongoose_1.model)('Order', orderSchema);
exports.default = Order;
