import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    product: z.string({
      required_error: 'Product is required',
    }),
    quantity: z.number({
      required_error: 'Quantity is required',
    }),
    paymentMethod: z.string({
      required_error: 'Payment method is required',
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    contactNo: z.string({
      required_error: 'Contact number is required',
    }),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered'], {
      required_error: 'Status is required',
    }),
    estimatedDeliveryDate: z.string().optional(),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
}; 