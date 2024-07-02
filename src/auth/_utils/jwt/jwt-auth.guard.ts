import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleEnum } from 'src/users/_utils/user-role.enum';
import { UserDocument } from 'src/users/user.schema';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return (super.canActivate(context) as any).then((x: UserDocument) => {
      if (!x) return x;
      const roles = this.reflector.get<UserRoleEnum[]>(
        'roles',
        context.getHandler(),
      );
      if (!roles || !roles.length) return x;
      const request = context.switchToHttp().getRequest();
      return roles.includes(request.user.role);
    });
  }
}
