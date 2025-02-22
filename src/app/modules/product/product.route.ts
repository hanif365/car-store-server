import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getSingleProduct);

// Protected routes
router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductController.createProduct,
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductController.updateProduct,
);

router.delete('/:id', auth(USER_ROLE.ADMIN), ProductController.deleteProduct);

export default router;
