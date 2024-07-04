import {
  BadRequestException,
  Injectable,
  PipeTransform,
  Scope,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

export function getDocumentByIdPipe(
  model: string | Type<any>,
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class GetByIdDynamicPipe implements PipeTransform {
    constructor(private readonly moduleRef: ModuleRef) {}

    async transform(id: string): Promise<any> {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('INVALID_MONGO_ID');
      }

      const modelToken = getModelToken(
        typeof model === 'string' ? model : (model as any).name,
      );
      const modelInstance = this.moduleRef.get<Model<any>>(modelToken, {
        strict: false,
      });

      const document = await modelInstance
        .findOne({ _id: id, deletedAt: null })
        .exec();
      if (!document) {
        throw new BadRequestException('DOCUMENT_NOT_FOUND');
      }

      return document;
    }
  }

  return GetByIdDynamicPipe;
}
