import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepo } from '../common/Repo/user.repo';
import { SecurityService } from '../common/Security/security.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { EmailService } from '../common/email/email.service';
import * as geoip from 'geoip-lite';
import { TokenService } from '../common/token/token.service';
import { RedisService } from '../common/redis/redis.service';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly securityService: SecurityService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
  ) {}

  async signUp(userData: CreateUserDTO, ip: string) {
    const { email, password, age, gender, phone, username } = userData;

    const geo = geoip.lookup(ip);
    const location = geo
      ? {
          country: geo.country,
          region: geo.region,
          city: geo.city,
          timezone: geo.timezone,
        }
      : undefined;

    const isEmailExist = await this.userRepo.findByEmail(email);
    const isUsernameUnique = await this.userRepo.findByUsername(username);
    if (isEmailExist) {
      throw new BadRequestException('email already exists');
    }
    if (isUsernameUnique) {
      throw new BadRequestException('choose another username');
    }

    const user = await this.userRepo.create({
      email,
      username,
      password: await this.securityService.createHash({ data: password }),
      age,
      gender,
      phone: await this.securityService.encryption({ data: phone }),
      ip,
      ...(location && { location }),
    });

    await this.emailService.sendRegisterOtp(email);
    return { data: { user } };
  }

  async login({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) {
    const user =
      (await this.userRepo.findByEmail(identifier)) ||
      (await this.userRepo.findByUsername(identifier));
    if (!user) {
      throw new BadRequestException('invalid email or username');
    }
    if (
      !(await this.securityService.compare({
        cipher: user.password,
        text: password,
      }))
    ) {
      throw new BadRequestException('invalid password');
    }
    const jti = nanoid();
    await this.redisService.set({
      key: this.redisService.getJtiKey(user.email, jti),
      value: jti,
      exType: 'EX',
      exValue: 30 * 60,
    });
    const accessToken = await this.tokenService.generateToken({
      payload: { _id: user._id },
      secret: process.env.ACCESS_TOKEN_SIGNATURE as string,
      options: { expiresIn: '30M', jwtid: jti },
    });
    const refreshToken = await this.tokenService.generateToken({
      payload: { _id: user._id },
      secret: process.env.REFRESH_TOKEN_SIGNATURE as string,
      options: { expiresIn: '7D' },
    });
    return { data: { accessToken, refreshToken } };
  }
}
