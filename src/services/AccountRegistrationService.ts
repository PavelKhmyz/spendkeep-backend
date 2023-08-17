import { Inject, Injectable } from '@nestjs/common';
import ServiceType from './ServiceType';
import { IUserData, IUserService } from './UserService';
import { IAccountService } from './AccountService';
import RepositoryType from '../data/repositories/RepositoryType';
import { ITransactionManager } from '../data/repositories/TransactionManager';
import UtilType from '../utils/UtilType';
import { IBcryptHashUtils } from '../utils/BcriptHashUtils';

interface IRegisterAccountParams {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  avatarUrl?: string;
}

export interface IAccountRegistrationService {
  register(params: IRegisterAccountParams): Promise<IUserData>
}

@Injectable()
export class AccountRegistrationService implements IAccountRegistrationService {
  constructor(
    @Inject(ServiceType.UserService) private readonly userService: IUserService,
    @Inject(ServiceType.AccountService) private readonly accountService: IAccountService,
    @Inject(RepositoryType.TransactionManager) private readonly transactionManager: ITransactionManager,
    @Inject(UtilType.BcriptHashUtils) private readonly bcryptHash: IBcryptHashUtils,
  ) {}

  public async register(params: IRegisterAccountParams): Promise<IUserData> {
    return this.transactionManager.useTransaction(async (sessionId) => {
      const { id } = await this.accountService.create(sessionId);
      const passwordHash = await this.bcryptHash.hash(params.password);

      return this.userService.create({ ...params, password: passwordHash, account: id }, sessionId);
    });
  }
}
