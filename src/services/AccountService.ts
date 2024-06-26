import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository, IAccountViewModel } from '../data/repositories/AccountRepository';
import RepositoryType from '../data/repositories/RepositoryType';

export interface IAccountService {
  create(sessionId?: string): Promise<IAccountViewModel>;
  find(id: string): Promise<IAccountViewModel>;
}

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(RepositoryType.AccountRepository) private readonly accountRepository: IAccountRepository,
  ) {}

  public async create(sessionId?: string): Promise<IAccountViewModel> {
    return this.accountRepository.createOne({}, sessionId);
  }

  public async find(id: string): Promise<IAccountViewModel> {
    return this.accountRepository.findOneBy({ id });
  }
}
