import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserRoleEnum } from 'src/users/_utils/user-role.enum';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ProtectedAutoRolesDecorator } from './protected-auto-roles.decorator';

export const Protect = (...roles: UserRoleEnum[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' }),
    ApiForbiddenResponse({ description: 'FORBIDDEN' }),
    ProtectedAutoRolesDecorator(...roles),
  );
