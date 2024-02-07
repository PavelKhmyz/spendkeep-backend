import { Inject, Injectable } from '@nestjs/common';
import RepositoryType from 'src/data/repositories/RepositoryType';
import { IWalletRepository, IWalletViewModel } from 'src/data/repositories/WalletRepository';
import NotFoundError from 'src/errors/NotFoundError';

interface ICreateWalletParams {
  userId: string;
  name: string;
}

interface IUpdateWalletParams {
  name?: string;
  isActive?: boolean;
  isPublic?: boolean;
}

interface IFindWalletParams {
  id?: string;
  userId?: string;
  isPublic?: boolean;
}

export interface IWalletService{
  create(params: ICreateWalletParams, accountId: string, sessionId?: string): Promise<IWalletViewModel>;
  findById(id: string, accountId: string): Promise<IWalletViewModel>;
  findMany(params: IFindWalletParams, accountId: string): Promise<IWalletViewModel[]>;
  updateOne(findParams: IFindWalletParams, params:IUpdateWalletParams, accountId: string): Promise<IWalletViewModel>;
}

@Injectable()
export default class WalletService implements IWalletService {
  constructor(
    @Inject(RepositoryType.WalletRepository) private readonly walletRepository: IWalletRepository,
  ) {}

  public async create(params: ICreateWalletParams, accountId: string, sessionId?: string): Promise<IWalletViewModel> {
    return this.walletRepository.createOne({ ...params, accountId }, sessionId);
  }

  public async findById(id: string, accountId: string): Promise<IWalletViewModel> {
    return this.walletRepository.findOneBy({ id, accountId });
  }

  public async findMany(params: IFindWalletParams, accountId: string): Promise<IWalletViewModel[]> {
    return this.walletRepository.findMany({ ...params, accountId });
  }

  public async updateOne(findParams: IFindWalletParams, params: IUpdateWalletParams, accountId: string): Promise<IWalletViewModel> {
    const updatedDocument = await this.walletRepository.updateOneBy({ ...findParams, accountId }, params);

    if (!updatedDocument) {
      throw new NotFoundError('Wallet not found');
    }

    return updatedDocument;
  }
}
