"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        brand: zod_1.z.string({
            required_error: 'Brand is required',
        }),
        model: zod_1.z.string({
            required_error: 'Model is required',
        }),
        yearOfManufacture: zod_1.z.number({
            required_error: 'Year of manufacture is required',
        }),
        price: zod_1.z.number({
            required_error: 'Price is required',
        }),
        category: zod_1.z.string({
            required_error: 'Category is required',
        }),
        stock: zod_1.z.number({
            required_error: 'Stock is required',
        }),
        description: zod_1.z.string({
            required_error: 'Description is required',
        }),
        image: zod_1.z.string({
            required_error: 'Image URL is required',
        }),
    }),
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        yearOfManufacture: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        category: zod_1.z.string().optional(),
        stock: zod_1.z.number().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
    }),
});
exports.ProductValidation = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
