import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IAuthReq } from './auth.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflectoer: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let req!: IAuthReq;
    const contextType = context.getType();
    switch (contextType) {
      case 'http':
        req = context.switchToHttp().getRequest();
        break;
      default:
        break;
    }
    const user = req.user;
    const roles = this.reflectoer.getAllAndMerge('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!roles.includes(user?.role)) {
      throw new UnauthorizedException('not authorized');
    }
    return true;
  }
}
