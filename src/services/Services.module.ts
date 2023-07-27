import { Module } from '@nestjs/common';
import RepositoriesModule from '../data/repositories/Repositories.module';
import { provideClass } from '../helpers/ModuleHelpers';
import ServiceType from './ServiceType';
import { UserService } from './UserService';

@Module({
  imports: [RepositoriesModule],
  providers: [
    provideClass(ServiceType.UserService, UserService),
  ],
  exports: [
    ServiceType.UserService,
  ],
})
export default class ServicesModule {}
