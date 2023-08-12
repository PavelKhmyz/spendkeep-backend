import { Inject, Injectable } from '@nestjs/common';
import ClientType from '../clients/ClientType';
import { RedisClientType, SetOptions } from 'redis';

export enum RedisTimeUnit {
  Seconds = 'EX',
  Milliseconds = 'PX',
}

interface IExpireIn {
  timeUnit: RedisTimeUnit;
  timeValue: number;
}

export interface IRedisService {
  set(key: string, value: string, expire?: IExpireIn): Promise<string>;
  delete(key: string): Promise<void>
  getOne(key: string): Promise<string>;
  getMany(key: string[]): Promise<string[]>
}

@Injectable()
export default class RedisService implements IRedisService {
  constructor(
    @Inject(ClientType.RedisClient) private readonly redisClient: RedisClientType,
  ) {}

  public async set(key: string, value: string, expire?: IExpireIn): Promise<string> {
    const expireQuery: SetOptions = expire ? { [expire.timeUnit]: expire.timeValue } : { KEEPTTL: true };

    await this.redisClient.set(key, value, expireQuery);

    return this.getOne(key);
  }
  
  public async delete(key: string): Promise<void> {
    await this.redisClient.DEL(key);
  }

  public async getOne(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  public async getMany(key: string[]): Promise<string[]> {
    return this.redisClient.MGET(key);
  }
}
