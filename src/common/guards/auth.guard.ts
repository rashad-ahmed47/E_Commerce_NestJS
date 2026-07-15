import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../token/token.service';
import { IHUser } from '../../DB/schema/user.schema';
import { RedisService } from '../redis/redis.service';

export interface IAuthReq extends Request {
  user?: IHUser;
}

@Injectable()
export class authGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType();
    let authorization!: string;
    let request!: IAuthReq;
    switch (contextType) {
      case 'http':
        request = context.switchToHttp().getRequest();
        authorization = request.headers.authorization as string;
        break;
      default:
        break;
    }
    const { user, jti } = await this.tokenService.decodeToken(authorization);

    if (!user) {
      throw new UnauthorizedException('invalid auth');
    }
    if (jti) {
      const redisJti = await this.redisService.get(
        `user:${user.email}:jti:${jti}`,
      );
      if (!redisJti) {
        throw new UnauthorizedException('login again');
      }
    }

    request.user = user;
    return true;
  }
}
