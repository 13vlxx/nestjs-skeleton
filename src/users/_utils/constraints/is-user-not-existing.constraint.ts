import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UsersRepository } from 'src/users/users.repository';

@ValidatorConstraint({ name: 'IsUserEmailAlreadyUsed', async: true })
@Injectable()
export class IsEmailAvailableConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersRepository: UsersRepository) {}
  async validate(email: string) {
    return !(await this.usersRepository.findOneByEmail(email));
  }

  defaultMessage(): string {
    return 'Email is already used';
  }
}

export function IsEmailAvailable(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'isEmailAvailable',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailAvailableConstraint,
    });
}
