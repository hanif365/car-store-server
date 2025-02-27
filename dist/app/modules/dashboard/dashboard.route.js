"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.get('/stats', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), dashboard_controller_1.DashboardController.getDashboardStats);
exports.default = router;
