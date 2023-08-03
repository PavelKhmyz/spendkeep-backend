import { Provider } from '@nestjs/common';
import ClientType from './ClientType';
import { createClient } from 'redis';
import ConfigType from 'src/config/ConfigType';

const redisClient: Provider<ReturnType<typeof createClient>> =  {
  provide: ClientType.RedisClient,
  useFactory: (redisUrl: string) => {
    const client = createClient({url: redisUrl});

    return client;
  },
  inject: [ConfigType.RedisUrl],
};

export default redisClient;
