import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserRepo } from '../Repo/user.repo';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepo,
  ) {}
  async generateToken({
    payload,
    secret,
    options,
  }: {
    payload: Object;
    secret: string;
    options: JwtSignOptions;
  }) {
    options.secret = secret;
    const token = await this.jwtService.signAsync(payload, options);
    return token;
  }

  async verifyToken({ secret, token }) {
    const payload = await this.jwtService.verifyAsync(token, { secret });
    return payload;
  }

  async decodeToken(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }

    const { email, _id, jti, iat } = (await this.verifyToken({
      token,
      secret: process.env.ACCESS_TOKEN_SIGNATURE as string,
    })) as {
      email: string;
      jti: string;
      iat: number;
      _id: string;
    };

    const user = await this.userRepo.findOne({
      _id,
      isEmailConfirmed: true,
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    if (iat * 1000 <= user.changedCredintalsAt?.getTime()) {
      throw new BadRequestException('log-in again');
    }
    return { user, jti };
  }
}
