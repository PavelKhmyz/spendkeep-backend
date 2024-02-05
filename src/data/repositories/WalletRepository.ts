import { Injectable } from '@nestjs/common';
import MongoRepository from './MongoRepository';
import { Wallet } from 'src/data/models/Wallet';
import { InjectModel } from '@nestjs/mongoose';
import ModelName from '../models/enums/ModelName';
import { FilterQuery, Model} from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IWalletViewModel {
  id: string;
  accountId: string;
  name: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IFindParams {
  id?: string;
  userId?: string;
  accountId?: string;
}

interface IFindManyParams {
  userId?: string;
  accountId?: string;
}

interface ICreateParams {
  user: string;
  account: string;
  name: string;
}

interface IUpdateParams {
  name?: string;
  isActive?: boolean;
}

interface IWalletRepositoryConfiguration {
  viewModel: IWalletViewModel;
  createParams: ICreateParams;
  findParams: IFindParams;
}

export interface IWalletRepository {
  createOne(params: ICreateParams, sessionId?: string): Promise<IWalletViewModel>;
  findOneBy(params: IFindParams): Promise<IWalletViewModel | null>;
  findMany(params: IFindManyParams): Promise<IWalletViewModel[]>;
  updateOneBy(findParams: IFindParams, params: IUpdateParams): Promise<IWalletViewModel>;
}

@Injectable()
export default class WalletRepository extends MongoRepository<
IWalletRepositoryConfiguration, 
Wallet
> implements IWalletRepository {
  constructor(
    @InjectModel(ModelName.Wallet) walletModel: Model<Wallet>
  ) {
    super({
      model: walletModel,
    });
  }

  protected getFindQuery(params: IFindParams): FilterQuery<Wallet> {
    const idMatch = params.id ? { _id: new ObjectId(params.id) } : {};
    const userIdMatch = params.userId ? { user: params.userId } : {};
    const accountIdMatch = params.accountId ? { account: params.accountId } : {};

    return {
      ...idMatch,
      ...userIdMatch,
      ...accountIdMatch,
    };
  }

  protected mapToDefaultViewModel(document: Wallet): IWalletViewModel | Promise<IWalletViewModel> {
    return {
      id: document._id.toString(),
      accountId: document.account.toString(),
      userId: document.user.toString(),
      name: document.name,
      isActive: document.isActive,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
