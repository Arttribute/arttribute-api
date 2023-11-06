import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { SetRequired } from 'type-fest';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export type UserPayload = SetRequired<JwtPayload, 'sub'> & {
  wallet_address: string;
};
