import { ValidationOptions } from 'class-validator';
import { FilterQuery } from 'mongoose';

export interface CustomValidationOptions<T> {
  property?: keyof T | '_id' | undefined;
  queries?: FilterQuery<T> | undefined;
  excludeDeleted?: boolean | undefined;
}

export type UniqueExistsValidationOptions<T> = CustomValidationOptions<T> &
  ValidationOptions;
