import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@biy/database';

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user: UserEntity = request.user;
  delete user.password;
  return user;
});
