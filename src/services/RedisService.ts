import { Inject, Injectable } from '@nestjs/common';
import ClientType from '../clients/ClientType';
import { IRedisClient } from 'src/clients/RedisClient';

export interface IRedisService {
  create(key: string, value: string, expire?: number): Promise<string>;
  delete(key: string): Promise<number>
  find(key: string): Promise<string>;
}

@Injectable()
export default class RedisService implements IRedisService {
  constructor(
    @Inject(ClientType.RedisClient) private readonly redisClient: IRedisClient,
  ) { }

  public async create(key: string, value: string, expire?: number): Promise<string> {
    return await this.redisClient.create(key, value, expire);
  }
  
  public async delete(key: string): Promise<number> {
    return await this.redisClient.delete(key);
  }
  public async find(key: string): Promise<string> {
    return await this.redisClient.find(key);
  }
}
