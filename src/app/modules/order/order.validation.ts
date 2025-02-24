import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      product: z.string({
        required_error: 'Product is required',
      }),
      quantity: z.number({
        required_error: 'Quantity is required',
      }),
    })),
    address: z.string({
      required_error: 'Address is required',
    }),
    contactNo: z.string({
      required_error: 'Contact number is required',
    }),
    city: z.string({
      required_error: 'City is required',
    }),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(
      ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      {
        required_error: 'Status is required',
      },
    ),
    estimatedDeliveryDate: z.string().optional(),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
};
