import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createClient } from 'redis';

import { UserRepo } from '../common/Repo/user.repo';
import { SecurityService } from '../common/Security/security.service';
import { EmailService } from '../common/email/email.service';
import { TokenModule } from '../common/token/token.module';
import { TokenService } from '../common/token/token.service';
import { User, userSchema } from '../DB/schema/user.schema';
import { RedisService } from '../common/redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepo,
    SecurityService,
    EmailService,
    JwtService,
    TokenService,
    {
      provide: 'RedisClient',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisClient = createClient({
          url: configService.get<string>('REDIS_URL'),
        });

        redisClient.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        try {
          await redisClient.connect();
          console.log('Redis connected');
        } catch (err) {
          console.error('Redis connection failed:', err);
          throw err;
        }

        return redisClient;
      },
    },
    RedisService,
  ],
})
export class AuthModule {}
