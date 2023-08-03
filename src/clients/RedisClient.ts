import { Inject, Injectable } from '@nestjs/common';
import { createClient, SetOptions } from 'redis';
import ConfigType from 'src/config/ConfigType';

type RedisConnection = ReturnType<typeof createClient>

export interface IRedisClient {
    create(key: string, value: string, expire?: SetOptions): Promise<string>;
    delete(key: string): Promise<void>
    getOne(key: string): Promise<string>;
    getMany(key: string[]): Promise<string[]>;
}

@Injectable()
export default class RedisClient implements IRedisClient {
  protected connection: RedisConnection;

  constructor(
    @Inject(ConfigType.RedisUrl) private readonly url: string,
  ) {
    this.connection = this.createConnection();
    this.connection.connect();
  }

  protected createConnection() {
    return createClient({ url: this.url });
  }

  public async create(key: string, value: string, expire?: SetOptions): Promise<string> {
    await this.connection.set(key, value, expire ? expire : {KEEPTTL: true});

    return this.getOne(key);
  }

  public async delete(key: string): Promise<void> {
    await this.connection.DEL(key);
  }

  public async getOne(key: string): Promise<string> {
    return await this.connection.get(key);
  }

  public async getMany(key: string[]): Promise<string[]> {
    return await this.connection.MGET(key);
  }
}
