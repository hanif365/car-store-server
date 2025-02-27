"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const handleValidationError = (err) => {
    const errorDetails = Object.values(err.errors).map((val) => ({
        path: val === null || val === void 0 ? void 0 : val.path,
        details: val === null || val === void 0 ? void 0 : val.message,
    }));
    return {
        statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        message: 'Validation Error',
        errorDetails,
    };
};
exports.default = handleValidationError;
