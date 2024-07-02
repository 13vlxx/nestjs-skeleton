import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Connection } from 'mongoose';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class UniqueExistsConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: any, args: ValidationArguments) {
    const [entity, column, flag] = args.constraints;

    const repository = this.connection.model(entity);
    const result = await repository.findOne({ [column]: value }).exec();
    return flag ? !!result : !result;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} "${args.value}" already exists`;
  }
}

export function IsUnique(
  entity: string,
  property: string,
  validationOptions?: ValidationOptions,
  flag: boolean = false,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, property, flag],
      validator: UniqueExistsConstraint,
    });
  };
}

export function IsExisting(
  entity: string,
  property: string,
  validationOptions?: ValidationOptions,
  flag: boolean = true,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, property, flag],
      validator: UniqueExistsConstraint,
    });
  };
}