import { Inject, Injectable } from '@nestjs/common';
import ClientType from '../clients/ClientType';
import { createClient } from 'redis';

interface IExpireIn {
  timeUnit: 'EX' | 'PX';
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
    @Inject(ClientType.RedisClient) private readonly redisClient: ReturnType<typeof createClient>,
  ) {
    this.redisClient.connect();
  }

  public async set(key: string, value: string, expire?: IExpireIn): Promise<string> {
    await this.redisClient.set(key, value, expire ? {[expire.timeUnit]: expire.timeValue} : {KEEPTTL: true});

    return this.getOne(key);
  }
  
  public async delete(key: string): Promise<void> {
    await this.redisClient.DEL(key);
  }

  public async getOne(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  public async getMany(key: string[]): Promise<string[]> {
    return await this.redisClient.MGET(key);
  }
}
