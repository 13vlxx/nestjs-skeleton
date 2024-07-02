import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ConnectedUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
