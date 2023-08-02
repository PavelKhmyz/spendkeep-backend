import { Module } from '@nestjs/common';
import ClientType from './ClientType';
import { provideClass } from '../helpers/ModuleHelpers';
import EmailClient from './EmailClient';
import UtilsModule from '../utils/Utils.module';
import ConfigModule from '../config/Config.module';
import RedisClient from './RedisClient';

@Module({
  imports: [UtilsModule, ConfigModule],
  providers: [
    provideClass(ClientType.EmailClient, EmailClient),
    provideClass(ClientType.RedisClient, RedisClient),
  ],
  exports: [
    ClientType.EmailClient,
    ClientType.RedisClient,
  ],
})
export default class ClientsModule {}
