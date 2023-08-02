import { Inject, Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import ConfigType from 'src/config/ConfigType';

type RedisConnection = ReturnType<typeof createClient>

export interface IRedisClient {
    create(key: string, value: string, expire?: number): Promise<string>;
    delete(key: string): Promise<number>
    find(key: string): Promise<string>;
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
    return createClient({url: this.url});
  }

  public async create(key: string, value: string, expire?: number) {
    await this.connection.set(key, value, {EX: expire});
    return this.find(key);
  }

  public async delete(key: string) {
    return await this.connection.DEL(key);
  }

  public async find(key: string) {
    return await this.connection.get(key);
  }

}