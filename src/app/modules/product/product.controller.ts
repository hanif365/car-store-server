import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';
import { StatusCodes } from 'http-status-codes';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body, req.user!);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  console.log("req.query", req.query);
  const result = await ProductService.getAllProducts(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getSingleProduct(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
}; 