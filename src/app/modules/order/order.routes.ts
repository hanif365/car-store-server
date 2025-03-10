import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderController.createOrder,
);

router.get('/verify-payment', OrderController.verifyPayment);

router.get('/my-orders', auth(USER_ROLE.USER), OrderController.getMyOrders);

router.get('/:id', auth(USER_ROLE.USER), OrderController.getSingleOrder);

router.get('/', auth(USER_ROLE.ADMIN), OrderController.getAllOrders);

router.patch(
  '/:id/status',
  auth(USER_ROLE.ADMIN),
  validateRequest(OrderValidation.updateOrderStatusValidationSchema),
  OrderController.updateOrderStatus,
);

export default router;
