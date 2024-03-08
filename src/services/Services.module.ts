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
import { SessionService } from './SessionService';
import WalletService from './WalletService';
import CategoryValidationService from './CategoryValidationService';
import CategoriesService from './CategoryService';
import ExpenseService from './ExpenseService';

@Module({
  imports: [RepositoriesModule, ClientsModule, UtilsModule],
  providers: [
    provideClass(ServiceType.UserService, UserService),
    provideClass(ServiceType.EmailService, EmailService),
    provideClass(ServiceType.RedisService, RedisService),
    provideClass(ServiceType.AccountService, AccountService),
    provideClass(ServiceType.AccountRegistrationService, AccountRegistrationService),
    provideClass(ServiceType.EmailVerificationService, EmailVerificationService),
    provideClass(ServiceType.SessionService, SessionService),
    provideClass(ServiceType.WalletService, WalletService),
    provideClass(ServiceType.CategoryValidationService, CategoryValidationService),
    provideClass(ServiceType.CategoriesService, CategoriesService),
    provideClass(ServiceType.ExpenseService, ExpenseService),
  ],
  exports: [
    ServiceType.UserService,
    ServiceType.EmailService,
    ServiceType.RedisService,
    ServiceType.AccountService,
    ServiceType.AccountRegistrationService,
    ServiceType.EmailVerificationService,
    ServiceType.SessionService,
    ServiceType.WalletService,
    ServiceType.CategoryValidationService,
    ServiceType.CategoriesService,
    ServiceType.ExpenseService,
  ],
})
export default class ServicesModule {}
