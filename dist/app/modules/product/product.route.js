"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// Public routes
router.get('/', product_controller_1.ProductController.getAllProducts);
router.get('/:id', product_controller_1.ProductController.getSingleProduct);
// Protected routes
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(product_validation_1.ProductValidation.createProductValidationSchema), product_controller_1.ProductController.createProduct);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(product_validation_1.ProductValidation.updateProductValidationSchema), product_controller_1.ProductController.updateProduct);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductController.deleteProduct);
exports.default = router;
