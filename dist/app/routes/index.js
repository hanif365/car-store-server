"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const product_route_1 = __importDefault(require("../modules/product/product.route"));
const order_routes_1 = __importDefault(require("../modules/order/order.routes"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const dashboard_route_1 = __importDefault(require("../modules/dashboard/dashboard.route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/products',
        route: product_route_1.default,
    },
    {
        path: '/orders',
        route: order_routes_1.default,
    },
    {
        path: '/users',
        route: user_route_1.default,
    },
    {
        path: '/dashboard',
        route: dashboard_route_1.default,
    },
];
// register all module routes dynamically
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.default = router;
