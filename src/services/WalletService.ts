import { Inject, Injectable } from '@nestjs/common';
import RepositoryType from 'src/data/repositories/RepositoryType';
import { IWalletRepository, IWalletViewModel } from 'src/data/repositories/WalletRepository';
import AccessForbiddenError from 'src/errors/AccessForbiddenError';

interface ICreateWalletParams {
  user: string;
  account: string;
  name: string;
}

interface IUpdateWalletParams {
  name?: string;
  isActive?: boolean;
}

interface IUpdateQueryParams {
  id: string;
  userId: string;
}

interface IFindManyParams {
  accountId?: string;
  userId?: string;
}

export interface IWalletService{
  create(params: ICreateWalletParams, sessionId?: string): Promise<IWalletViewModel>;
  find(id: string): Promise<IWalletViewModel>;
  findMany(params: IFindManyParams): Promise<IWalletViewModel[]>;
  update(id: IUpdateQueryParams, params:IUpdateWalletParams): Promise<IWalletViewModel>;
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

  public async update(id: IUpdateQueryParams, params: IUpdateWalletParams): Promise<IWalletViewModel> {
    const updatedDocument = await this.walletRepository.updateOneBy(id, params);

    if (!updatedDocument) {
      throw new AccessForbiddenError('No access');
    }

    return updatedDocument;
  }  
}
