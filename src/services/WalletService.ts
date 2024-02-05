import { Inject, Injectable } from '@nestjs/common';
import RepositoryType from 'src/data/repositories/RepositoryType';
import { IWalletRepository, IWalletViewModel } from 'src/data/repositories/WalletRepository';

interface ICreateWalletParams {
  user: string;
  account: string;
  name: string;
}

interface IFindManyParams {
  [key: string]: string;
}

export interface IWalletService{
  create(params: ICreateWalletParams, sessionId?: string): Promise<IWalletViewModel>;
  find(id: string): Promise<IWalletViewModel>;
  findMany(params: IFindManyParams): Promise<IWalletViewModel[]>;
}

@Injectable()
export default class WalletService implements IWalletService {
  constructor(
    @Inject(RepositoryType.WalletRepository) private readonly walletRepository: IWalletRepository,
  ) {}

  public async create(params: ICreateWalletParams, sessionId?: string): Promise<IWalletViewModel> {
    return this.walletRepository.createOne(params, sessionId);
  }

  public async find(id: string): Promise<IWalletViewModel> {
    return this.walletRepository.findOneBy({ id });
  }

  public async findMany(params: IFindManyParams): Promise<IWalletViewModel[]> {
    return this.walletRepository.findMany(params);
  }
}
