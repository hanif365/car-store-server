import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import productRoutes from "../modules/product/product.route";
import orderRoutes from "../modules/order/order.routes";
import userRoutes from "../modules/user/user.route";
import dashboardRoutes from "../modules/dashboard/dashboard.route";


const router = Router();

export interface Routes {
  path: string;
  route: Router;
}

const moduleRoutes: Routes[] = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/products',
    route: productRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },  
];

// register all module routes dynamically
moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
