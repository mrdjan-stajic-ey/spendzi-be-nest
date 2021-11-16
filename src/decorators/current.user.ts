import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(ctx: ExecutionContext, handler: CallHandler) {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request || {};
    const { username } = user;
    if (username) {
      const user = await this.userService.findOne(username);
      request.currentUser = user;
    }

    return handler.handle();
  }
}

export interface IAppUserRequestInfo {
  currentUser: User & {
    _id: string; //FML and fuck mongo and fuck orms.
  };
}
