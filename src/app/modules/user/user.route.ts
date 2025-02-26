import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// Admin routes
router.patch(
  '/:id/status',
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.updateStatusValidationSchema),
  UserController.updateUserStatus,
);

// User routes
router.patch(
  '/change-password',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(UserValidation.changePasswordValidationSchema),
  UserController.changePassword,
);

router.patch(
  '/update-profile',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserController.updateProfile,
);

// Protected admin-only routes
router.get(
  '/',
  auth(USER_ROLE.ADMIN),
  UserController.getAllUsers,
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

router.get(
  '/my-profile',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserController.getMyProfile
);

export default router; 