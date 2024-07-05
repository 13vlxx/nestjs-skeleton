import {
  BadRequestException,
  Injectable,
  PipeTransform,
  Scope,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';
import { CustomValidationOptions } from '../decorators/options/custom-validation.options';
import { ClassType } from '../decorators/unique-exists.decorator';

export function getDocumentPipe<T>(
  model: ClassType<T>,
  validationOptions?: CustomValidationOptions<T>,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class GetByPropertyDynamicPipe implements PipeTransform {
    constructor(private readonly moduleRef: ModuleRef) {}

    async transform(id: string): Promise<T> {
      if (!validationOptions?.property && !isValidObjectId(id)) {
        throw new BadRequestException('INVALID_MONGO_ID');
      }

      const modelToken = getModelToken(model.name);
      const modelInstance = this.moduleRef.get<Model<T>>(modelToken, {
        strict: false,
      });

      const query: FilterQuery<any> = {
        [validationOptions?.property ?? '_id']: id,
        ...validationOptions?.queries,
      };
      if (validationOptions?.excludeDeleted) query.deletedAt = null;

      const document = await modelInstance.findOne(query).exec();
      if (!document) {
        throw new BadRequestException(`${model.name.toUpperCase()}_NOT_FOUND`);
      }

      return document;
    }
  }

  return GetByPropertyDynamicPipe;
}
