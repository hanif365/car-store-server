"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const mongoose_1 = __importDefault(require("mongoose"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Something went wrong!';
    let errorDetails = [];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorDetails = simplifiedError.errorDetails;
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorDetails = simplifiedError.errorDetails;
    }
    else if (err instanceof AppError_1.AppError) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        errorDetails = [
            {
                path: '',
                details: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err === null || err === void 0 ? void 0 : err.message;
        errorDetails = [
            {
                path: '',
                details: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        error: {
            details: errorDetails,
        },
        stack: config_1.default.env === 'development' ? err === null || err === void 0 ? void 0 : err.stack : undefined,
    });
    next();
};
exports.globalErrorHandler = globalErrorHandler;
