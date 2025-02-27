"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(order_validation_1.OrderValidation.createOrderValidationSchema), order_controller_1.OrderController.createOrder);
router.get('/verify-payment', order_controller_1.OrderController.verifyPayment);
router.get('/my-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), order_controller_1.OrderController.getMyOrders);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), order_controller_1.OrderController.getSingleOrder);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), order_controller_1.OrderController.getAllOrders);
router.patch('/:id/status', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(order_validation_1.OrderValidation.updateOrderStatusValidationSchema), order_controller_1.OrderController.updateOrderStatus);
exports.default = router;
