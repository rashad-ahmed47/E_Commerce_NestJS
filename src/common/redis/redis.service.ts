import { Inject, Injectable } from '@nestjs/common';
import { type RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('RedisClient') private readonly redisClient: RedisClientType,
  ) {}

  getJtiKey(email: string, jti: string) {
    return `user:${email}:jti:${jti}`;
  }

  async set({
    key,
    value,
    exType = 'EX',
    exValue,
  }: {
    key: string;
    value: string | number;
    exType?: 'EX' | 'PX' | 'EXAT' | 'PXAT';
    exValue?: number;
  }) {
    const options: any = {};
    if (exValue) {
      options[exType] = exValue;
    }

    return await this.redisClient.set(key, value, options);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }
}
