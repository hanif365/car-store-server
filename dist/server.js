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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
let server;
process.on('uncaughtException', (error) => {
    console.log('🔥 Uncaught Exception detected...');
    console.log(error);
    process.exit(1);
});
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(config_1.default.mongodb_uri);
        console.log('🛢 Database connection successful');
    });
}
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectDB();
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`🚀 Server is running on port ${config_1.default.port}`);
            });
        }
        catch (err) {
            console.error('😥 Failed to connect server:', err);
            process.exit(1);
        }
        process.on('unhandledRejection', (error) => {
            console.log('🔥 Unhandled Rejection detected...');
            if (server) {
                server.close(() => {
                    console.log(error);
                    process.exit(1);
                });
            }
        });
        process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
            console.log('SIGTERM received...');
            if (server) {
                server.close(() => {
                    mongoose_1.default.connection.close().then(() => {
                        process.exit(0);
                    });
                });
                setTimeout(() => {
                    console.log('Forcing shutdown...');
                    process.exit(1);
                }, 5000);
            }
        }));
    });
}
bootstrap();
