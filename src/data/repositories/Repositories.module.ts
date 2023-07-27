import { Module } from '@nestjs/common';
import ModelsModule from '../models';
import { provideClass } from '../../helpers/ModuleHelpers';
import RepositoryType from './RepositoryType';
import TransactionManager from './TransactionManager';
import UserRepository from './UserRepository';

@Module({
  imports: [
    ModelsModule,
  ],
  providers: [
    provideClass(RepositoryType.TransactionManager, TransactionManager),
    provideClass(RepositoryType.UserRepository, UserRepository),
  ],
  exports: [
    RepositoryType.TransactionManager,
    RepositoryType.UserRepository,
  ],
})
export default class RepositoriesModule {}
