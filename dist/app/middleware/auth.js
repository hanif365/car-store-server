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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../errors/AppError");
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Check authorization header exists or not
        const token = req.headers.authorization;
        // console.log("token from auth middleware", token);
        if (!token) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized Access');
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token.split(' ')[1], config_1.default.jwt_access_secret);
        // Check user exists or not
        const user = yield user_model_1.default.findById(decoded.userId);
        // console.log('user', user);
        if (!user) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Check user is blocked or not
        if (!user.isActive) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account has been deactivated');
        }
        // Check user have permission or not
        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not authorized');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
