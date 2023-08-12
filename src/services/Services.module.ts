import { Module } from '@nestjs/common';
import RepositoriesModule from '../data/repositories/Repositories.module';
import { provideClass } from '../helpers/ModuleHelpers';
import ServiceType from './ServiceType';
import { UserService } from './UserService';
import ClientsModule from '../clients/Clients.module';
import EmailService from './EmailService';
import RedisService from './RedisService';

@Module({
  imports: [RepositoriesModule, ClientsModule],
  providers: [
    provideClass(ServiceType.UserService, UserService),
    provideClass(ServiceType.EmailService, EmailService),
    provideClass(ServiceType.RedisService, RedisService),
  ],
  exports: [
    ServiceType.UserService,
    ServiceType.EmailService,
    ServiceType.RedisService,
  ],
})
export default class ServicesModule {}
