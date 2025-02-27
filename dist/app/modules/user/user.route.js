"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const user_constant_1 = require("./user.constant");
const router = express_1.default.Router();
// Admin routes
router.patch('/:id/status', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateStatusValidationSchema), user_controller_1.UserController.updateUserStatus);
// User routes
router.patch('/change-password', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(user_validation_1.UserValidation.changePasswordValidationSchema), user_controller_1.UserController.changePassword);
router.patch('/update-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateProfileValidationSchema), user_controller_1.UserController.updateProfile);
// Protected admin-only routes
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserValidationSchema), user_controller_1.UserController.updateUser);
router.get('/my-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), user_controller_1.UserController.getMyProfile);
exports.default = router;
