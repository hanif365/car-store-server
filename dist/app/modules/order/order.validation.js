"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const createOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            product: zod_1.z.string({
                required_error: 'Product is required',
            }),
            quantity: zod_1.z.number({
                required_error: 'Quantity is required',
            }),
        })),
        address: zod_1.z.string({
            required_error: 'Address is required',
        }),
        contactNo: zod_1.z.string({
            required_error: 'Contact number is required',
        }),
        city: zod_1.z.string({
            required_error: 'City is required',
        }),
    }),
});
const updateOrderStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], {
            required_error: 'Status is required',
        }),
        estimatedDeliveryDate: zod_1.z.string().optional(),
    }),
});
exports.OrderValidation = {
    createOrderValidationSchema,
    updateOrderStatusValidationSchema,
};
