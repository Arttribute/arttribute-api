import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Address = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.address;
  },
);
