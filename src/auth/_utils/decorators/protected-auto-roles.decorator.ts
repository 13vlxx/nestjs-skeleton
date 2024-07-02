import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { UserRoleEnum } from 'src/users/_utils/user-role.enum';

export function ProtectedAutoRolesDecorator(...roles: UserRoleEnum[]): any {
  return (target: any, key: any, descriptor: PropertyDescriptor) => {
    const current =
      Reflect.getMetadata(DECORATORS.API_OPERATION, descriptor.value) || {};
    const rolesSummary = roles.length > 0 ? roles.join(', ') : 'ALL';
    current.summary += ` (${rolesSummary})`;
    Reflect.defineMetadata(DECORATORS.API_OPERATION, current, descriptor.value);
  };
}
