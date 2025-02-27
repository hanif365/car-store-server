"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const order_model_1 = __importDefault(require("../order/order.model"));
const product_model_1 = __importDefault(require("../product/product.model"));
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get total users
    const totalUsers = yield user_model_1.default.countDocuments();
    // Get orders statistics
    const orders = yield order_model_1.default.find();
    // Get total sold products
    const totalSoldProducts = orders.reduce((acc, order) => {
        var _a;
        return (acc + (((_a = order.items) === null || _a === void 0 ? void 0 : _a.reduce((sum, item) => sum + item.quantity, 0)) || 0));
    }, 0);
    // Get total revenue
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    // Get total products in inventory
    const totalProducts = yield product_model_1.default.countDocuments();
    // Get monthly sales data for the current year
    const currentYear = new Date().getFullYear();
    const monthlySales = Array(12).fill(0);
    for (const order of orders) {
        const orderDate = new Date(order._id.getTimestamp());
        if (orderDate.getFullYear() === currentYear) {
            const month = orderDate.getMonth();
            monthlySales[month] += (order === null || order === void 0 ? void 0 : order.totalPrice) || 0;
        }
    }
    // Initialize monthly cars sold data with zeros
    const monthlySoldProducts = Array(12).fill(0);
    for (const order of orders) {
        const orderDate = new Date(order._id.getTimestamp());
        if (orderDate.getFullYear() === currentYear) {
            const month = orderDate.getMonth();
            const productCount = ((_a = order.items) === null || _a === void 0 ? void 0 : _a.reduce((sum, item) => sum + item.quantity, 0)) || 0;
            monthlySoldProducts[month] += productCount;
        }
    }
    return {
        totalUsers,
        totalSoldProducts,
        totalRevenue,
        totalProducts,
        monthlySales,
        monthlySoldProducts,
    };
});
exports.DashboardService = {
    getDashboardStats,
};
