"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const notFound = (req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
        error: [{ details: [{ path: req.originalUrl, message: "API not found!" }] }],
        stack: config_1.default.env === "development" ? new Error().stack : null,
    });
};
exports.default = notFound;
