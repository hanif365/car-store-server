import express from 'express';
import { DashboardController } from './dashboard.controller';

import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';

const router = express.Router();

router.get(
  '/stats',
  auth(USER_ROLE.ADMIN),
  DashboardController.getDashboardStats,
);

export default router;


