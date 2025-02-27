"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const handleZodError = (err) => {
    const errorDetails = err.issues.map((issue) => ({
        path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
        details: issue === null || issue === void 0 ? void 0 : issue.message,
    }));
    return {
        statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        message: 'Validation Error',
        errorDetails,
    };
};
exports.default = handleZodError;
