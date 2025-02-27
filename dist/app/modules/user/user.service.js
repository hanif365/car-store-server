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
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("./user.model"));
const AppError_1 = require("../../errors/AppError");
const config_1 = __importDefault(require("../../config"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({});
    return users;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    const result = yield user_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const updateUserStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    // Check if target user is an admin
    if (user.role === 'admin') {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Admin status cannot be changed');
    }
    const result = yield user_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.default.findById(user.userId).select('+password');
    if (!userData) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    const isPasswordMatched = yield user_model_1.default.isPasswordMatched(payload.currentPassword, userData.password);
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Current password is incorrect');
    }
    // Hash the new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.default.findByIdAndUpdate(user.userId, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    }, {
        new: true,
        runValidators: true,
    });
    return null;
});
const updateProfile = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, profileImage } = payload;
    const result = yield user_model_1.default.findByIdAndUpdate(user.userId, {
        name,
        profileImage,
    }, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findById(user.userId);
    if (!result) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    return result;
});
exports.UserService = {
    getAllUsers,
    updateUser,
    updateUserStatus,
    changePassword,
    updateProfile,
    getMyProfile,
};
