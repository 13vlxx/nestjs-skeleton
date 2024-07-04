import { ConflictException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Connection, FilterQuery, isValidObjectId } from 'mongoose';
import { UniqueExistsValidationOptions } from './options/unique-exists.options';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueExistsConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate<T>(value: any, args: ValidationArguments) {
    const [entity, validationOptions, property, flag] = args.constraints;
    const options: UniqueExistsValidationOptions<T> = validationOptions || {};

    if (
      options.property === '_id' ||
      (property === '_id' && !isValidObjectId(value))
    )
      throw new ConflictException('Invalid ObjectId');

    const repository = this.connection.model(entity);
    const query: FilterQuery<any> = { [options.property || property]: value };
    if (!options.includeDeleted) query.deletedAt = null;

    const result = await repository.findOne(query).exec();

    return flag ? !!result : !result;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} '${args.value}' ${args.constraints[3] ? 'does not exist' : 'already exists'}`;
  }
}

export function IsUnique<T>(
  entity: ClassType<T>,
  validationOptions?: UniqueExistsValidationOptions<T>,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity.name, validationOptions, propertyName, false],
      validator: UniqueExistsConstraint,
    });
  };
}

export function IsExisting<T>(
  entity: ClassType<T>,
  validationOptions?: UniqueExistsValidationOptions<T>,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isExisting',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, validationOptions, propertyName, true],
      validator: UniqueExistsConstraint,
    });
  };
}

export type ClassType<T> = new (...args: any[]) => T;
