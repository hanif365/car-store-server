import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
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
      const priceFilter: Record<string, number> = {};

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

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    // console.log("this.modelQuery", this.modelQuery);
    return this;
  }

  sort() {
    const sortBy = this.query?.sortBy as string;
    const sortOrder = (this.query?.sortOrder as string)?.toLowerCase();
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
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
}

export default QueryBuilder;
