import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    brand: z.string({
      required_error: 'Brand is required',
    }),
    model: z.string({
      required_error: 'Model is required',
    }),
    yearOfManufacture: z.number({
      required_error: 'Year of manufacture is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }),
    category: z.string({
      required_error: 'Category is required',
    }),
    stock: z.number({
      required_error: 'Stock is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    image: z.string({
      required_error: 'Image URL is required',
    }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    yearOfManufacture: z.number().optional(),
    price: z.number().optional(),
    category: z.string().optional(),
    stock: z.number().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
