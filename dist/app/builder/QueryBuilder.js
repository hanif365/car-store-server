"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
            'sortBy',
            'sortOrder',
        ];
        excludeFields.forEach((el) => delete queryObj[el]);
        // Handle price range filtering
        if (queryObj.minPrice !== undefined || queryObj.maxPrice !== undefined) {
            const priceFilter = {};
            if (queryObj.minPrice) {
                priceFilter.$gte = Number(queryObj.minPrice);
            }
            if (queryObj.maxPrice) {
                priceFilter.$lte = Number(queryObj.maxPrice);
            }
            queryObj.price = priceFilter;
            delete queryObj.minPrice;
            delete queryObj.maxPrice;
        }
        // Stock availability
        if (queryObj.inStock === 'true') {
            queryObj.stock = { $gt: 0 };
            delete queryObj.inStock;
        }
        console.log('queryObj', queryObj);
        this.modelQuery = this.modelQuery.find(queryObj);
        // console.log("this.modelQuery", this.modelQuery);
        return this;
    }
    sort() {
        var _a, _b, _c;
        const sortBy = (_a = this.query) === null || _a === void 0 ? void 0 : _a.sortBy;
        const sortOrder = (_c = (_b = this.query) === null || _b === void 0 ? void 0 : _b.sortOrder) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        const order = sortOrder === 'asc' ? 1 : -1;
        // If sortBy is provided, sort by that field
        if (sortBy) {
            this.modelQuery = this.modelQuery.sort({ [sortBy]: order });
        }
        // If only sortOrder is provided, sort by createdAt
        else if (sortOrder) {
            this.modelQuery = this.modelQuery.sort({ createdAt: order });
        }
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
}
exports.default = QueryBuilder;
