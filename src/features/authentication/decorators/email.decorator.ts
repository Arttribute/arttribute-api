import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Email = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.email;
  },
);
