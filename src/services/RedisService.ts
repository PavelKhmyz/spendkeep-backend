import { Inject, Injectable } from '@nestjs/common';
import ClientType from '../clients/ClientType';
import { IRedisClient } from 'src/clients/RedisClient';

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
    @Inject(ClientType.RedisClient) private readonly redisClient: IRedisClient,
  ) { }

  public async set(key: string, value: string, expire?: IExpireIn): Promise<string> {

    return await this.redisClient.create(key, value, expire ? {[expire.timeUnit]: expire.timeValue} : undefined);
  }
  
  public async delete(key: string): Promise<void> {
    await this.redisClient.delete(key);
  }

  public async getOne(key: string): Promise<string> {
    return await this.redisClient.getOne(key);
  }

  public async getMany(key: string[]): Promise<string[]> {
    return await this.redisClient.getMany(key);
  }
}
