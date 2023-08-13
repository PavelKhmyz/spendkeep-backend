import { Module } from '@nestjs/common';
import ModelsModule from '../models';
import { provideClass } from '../../helpers/ModuleHelpers';
import RepositoryType from './RepositoryType';
import TransactionManager from './TransactionManager';
import UserRepository from './UserRepository';
import DatabaseModule from '../Database.module';
import AccountRepository from './AccountRepository';

@Module({
  imports: [
    DatabaseModule,
    ModelsModule,
  ],
  providers: [
    provideClass(RepositoryType.TransactionManager, TransactionManager),
    provideClass(RepositoryType.UserRepository, UserRepository),
    provideClass(RepositoryType.AccountRepository, AccountRepository),
  ],
  exports: [
    RepositoryType.TransactionManager,
    RepositoryType.UserRepository,
    RepositoryType.AccountRepository,
  ],
})
export default class RepositoriesModule {}
