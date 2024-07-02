import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export const SolidPassword = () =>
  applyDecorators(
    ApiProperty({
      description:
        'Minimum 8 characters, at least one lower case, one upper case, one number and one special character',
    }),
    IsStrongPassword({
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minLength: 8,
    }),
  );
