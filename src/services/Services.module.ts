import { Module } from '@nestjs/common';
import RepositoriesModule from '../data/repositories/Repositories.module';
import { provideClass } from '../helpers/ModuleHelpers';
import ServiceType from './ServiceType';
import { UserService } from './UserService';
import ClientsModule from '../clients/Clients.module';
import EmailService from './EmailService';
import RedisService from './RedisService';
import { AccountService } from './AccountService';
import { AccountRegistrationService } from './AccountRegistrationService';
import UtilsModule from '../utils/Utils.module';
import { EmailVerificationService } from './EmailVerificationService';

@Module({
  imports: [RepositoriesModule, ClientsModule, UtilsModule],
  providers: [
    provideClass(ServiceType.UserService, UserService),
    provideClass(ServiceType.EmailService, EmailService),
    provideClass(ServiceType.RedisService, RedisService),
    provideClass(ServiceType.AccountService, AccountService),
    provideClass(ServiceType.AccountRegistrationService, AccountRegistrationService),
    provideClass(ServiceType.EmailVerificationService, EmailVerificationService),
  ],
  exports: [
    ServiceType.UserService,
    ServiceType.EmailService,
    ServiceType.RedisService,
    ServiceType.AccountService,
    ServiceType.AccountRegistrationService,
    ServiceType.EmailVerificationService,
  ],
})
export default class ServicesModule {}
