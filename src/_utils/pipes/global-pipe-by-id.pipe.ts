import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Scope,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel, getModelToken } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class GlobalPipeById<T> implements PipeTransform {
  constructor(
    @InjectModel('MODEL_NAME') private readonly model: Model<T>,
    private readonly moduleRef: ModuleRef,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(id: string, metadata: ArgumentMetadata): Promise<T> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('INVALID_MONGO_ID');
    }

    const modelToken = getModelToken(this.model.name);
    const model = this.moduleRef.get<Model<T>>(modelToken);

    const document = await model.findById(id).exec();
    if (!document) {
      throw new BadRequestException('DOCUMENT_NOT_FOUND');
    }

    return document;
  }
}

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
