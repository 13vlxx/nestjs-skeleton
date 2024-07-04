import { ValidationOptions } from 'class-validator';

export interface UniqueExistsValidationOptions<T> extends ValidationOptions {
  property?: keyof T | '_id' | undefined;
  includeDeleted?: boolean | undefined;
}
