import { Module } from '@nestjs/common';
import ModelsModule from '../models';
import { provideClass } from '../../helpers/ModuleHelpers';
import RepositoryType from './RepositoryType';
import TransactionManager from './TransactionManager';
import UserRepository from './UserRepository';
import DatabaseModule from '../Database.module';
import AccountRepository from './AccountRepository';
import WalletRepository from './WalletRepository';
import CategoryRepository from './CategoryRepository';
import ExpenseRepository from './ExpenseRepository';

@Module({
  imports: [
    DatabaseModule,
    ModelsModule,
  ],
  providers: [
    provideClass(RepositoryType.TransactionManager, TransactionManager),
    provideClass(RepositoryType.UserRepository, UserRepository),
    provideClass(RepositoryType.AccountRepository, AccountRepository),
    provideClass(RepositoryType.WalletRepository, WalletRepository),
    provideClass(RepositoryType.CategoryRepository, CategoryRepository),
    provideClass(RepositoryType.ExpenseRepository, ExpenseRepository),
  ],
  exports: [
    RepositoryType.TransactionManager,
    RepositoryType.UserRepository,
    RepositoryType.AccountRepository,
    RepositoryType.WalletRepository,
    RepositoryType.CategoryRepository,
    RepositoryType.ExpenseRepository,
  ],
})
export default class RepositoriesModule {}
