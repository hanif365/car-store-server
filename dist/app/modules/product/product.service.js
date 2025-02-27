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
exports.ProductService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const product_model_1 = __importDefault(require("./product.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createProduct = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    payload.createdBy = user.userId;
    const result = yield product_model_1.default.create(payload);
    return result;
});
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.default.find({ isDeleted: false }), query)
        .search(['name', 'brand', 'category', 'model'])
        .filter()
        .sort()
        .paginate();
    const result = yield productQuery.modelQuery.populate('createdBy', 'name email');
    const total = yield product_model_1.default.countDocuments(productQuery.modelQuery.getQuery());
    return {
        data: result,
        meta: {
            page: Number(query.page) || 1,
            limit: Number(query.limit) || 10,
            total
        }
    };
});
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findOne({ _id: id, isDeleted: false }).populate('createdBy', 'name email');
    if (!product) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found');
    }
    return product;
});
const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findOne({ _id: id, isDeleted: false });
    if (!product) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found');
    }
    const result = yield product_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findOne({ _id: id, isDeleted: false });
    if (!product) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found');
    }
    const result = yield product_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
exports.ProductService = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};
