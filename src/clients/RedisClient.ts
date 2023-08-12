import ClientType from './ClientType';
import { createClient } from 'redis';
import ConfigType from 'src/config/ConfigType';

const provideRedisClient = () =>  ({
  provide: ClientType.RedisClient,
  useFactory: (redisUrl: string) => {
    const client = createClient({ url: redisUrl });

    client.connect();

    return client;
  },
  inject: [ConfigType.RedisUrl],
});

export default provideRedisClient;
