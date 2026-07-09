import { Injectable } from '@nestjs/common';
import {
  QueryFilter,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  HydratedDocument,
} from 'mongoose';

@Injectable()
export class DBRepo<T> {
  constructor(private readonly model: Model<T>) {}

  // ─── Create ───────────────────────────────────────────────────────────────

  /**
   * Creates and saves a new document in the collection.
   * @param data - The data to create the document with.
   * @returns The newly created hydrated document.
   */
  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    const doc = new this.model(data);
    return doc.save() as Promise<HydratedDocument<T>>;
  }

  // ─── FindOne ──────────────────────────────────────────────────────────────

  /**
   * Finds a single document matching the filter.
   * @param filter  - Mongoose filter query.
   * @param projection - Fields to include/exclude.
   * @param options    - Additional query options (e.g. populate, lean).
   * @returns The first matching document or null.
   */
  async findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model
      .findOne(filter, projection, options)
      .exec() as Promise<HydratedDocument<T> | null>;
  }

  // ─── FindById ─────────────────────────────────────────────────────────────

  /**
   * Finds a document by its _id.
   * @param id         - The document's ObjectId or string id.
   * @param projection - Fields to include/exclude.
   * @param options    - Additional query options.
   * @returns The matching document or null.
   */
  async findById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model
      .findById(id, projection, options)
      .exec() as Promise<HydratedDocument<T> | null>;
  }

  // ─── Find ─────────────────────────────────────────────────────────────────

  /**
   * Finds all documents matching the filter.
   * @param filter     - Mongoose filter query.
   * @param projection - Fields to include/exclude.
   * @param options    - Additional query options (e.g. sort, limit, skip).
   * @returns Array of matching hydrated documents.
   */
  async find(
    filter: QueryFilter<T> = {},
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T>[]> {
    return this.model
      .find(filter, projection, options)
      .exec() as Promise<HydratedDocument<T>[]>;
  }

  // ─── Paginate ─────────────────────────────────────────────────────────────

  /**
   * Returns a paginated result set.
   * @param filter     - Mongoose filter query.
   * @param page       - Page number (1-indexed).
   * @param limit      - Number of documents per page.
   * @param projection - Fields to include/exclude.
   * @param options    - Additional query options (e.g. sort).
   * @returns An object containing the data array, total count, page, limit,
   *          total pages, and convenience flags.
   */
  async paginate(
    filter: QueryFilter<T> = {},
    page: number = 1,
    limit: number = 10,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<{
    data: HydratedDocument<T>[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model
        .find(filter, projection, { ...options, skip, limit })
        .exec() as Promise<HydratedDocument<T>[]>,
      this.model.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  // ─── GetDbDoc ─────────────────────────────────────────────────────────────

  /**
   * Retrieves the raw Mongoose document (hydrated) for a given filter.
   * Useful when you need to call Mongoose instance methods (e.g. .save()).
   * @param filter  - Mongoose filter query.
   * @param options - Additional query options.
   * @returns The hydrated document or null.
   */
  async getDbDoc(
    filter: QueryFilter<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model
      .findOne(filter, {}, options)
      .exec() as Promise<HydratedDocument<T> | null>;
  }

  // ─── FindOneAndUpdate ─────────────────────────────────────────────────────

  /**
   * Atomically finds a document and updates it.
   * Defaults to returning the updated document (new: true).
   * @param filter  - Mongoose filter query.
   * @param update  - Update operations to apply.
   * @param options - Query options (defaults: new=true, runValidators=true).
   * @returns The updated document or null if not found.
   */
  async findOneAndUpdate(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options: QueryOptions<T> = {},
  ): Promise<HydratedDocument<T> | null> {
    return this.model
      .findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
        ...options,
      })
      .exec() as Promise<HydratedDocument<T> | null>;
  }

  // ─── UpdateOne ────────────────────────────────────────────────────────────

  /**
   * Updates the first document matching the filter without returning it.
   * @param filter  - Mongoose filter query.
   * @param update  - Update operations to apply.
   * @param options - Query options (defaults: runValidators=true).
   * @returns Mongoose UpdateResult (matchedCount, modifiedCount, etc.).
   */
  async updateOne(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options: QueryOptions<T> = {},
  ): Promise<{ matchedCount: number; modifiedCount: number; acknowledged: boolean }> {
    return this.model
      .updateOne(filter, update, { runValidators: true, ...options } as any)
      .exec() as Promise<{ matchedCount: number; modifiedCount: number; acknowledged: boolean }>;
  }
}
