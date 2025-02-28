"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'https://car-store-client-ten.vercel.app',
        'http://localhost:5173',
    ],
    credentials: true,
}));
// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to our Car Store Server API',
        version: '1.0.0',
        API_documentation: 'https://documenter.getpostman.com/view/31322920/2sAYdfrXUP',
        success: true,
    });
});
// application routes
app.use('/api', routes_1.default);
// not found handler
app.use(notFound_1.default);
// global error handler
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
