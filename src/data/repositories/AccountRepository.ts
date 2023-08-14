import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import MongoRepository from './MongoRepository';
import { Account } from '../models/Account';
import ModelName from '../models/enums/ModelName';
import { FilterQuery, Model } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IAccountViewModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IFindParams {
  id?: string;
}

type ICreateParams = Record<string, never>

export interface IAccountRepository {
  createOne(params: ICreateParams, sessionId?: string): Promise<IAccountViewModel>;
  findOneBy(params: IFindParams): Promise<IAccountViewModel | null>;
}

interface IAccountRepositoryConfiguration {
  viewModel: IAccountViewModel;
  createParams: ICreateParams;
  findParams: IFindParams;
}

@Injectable()
export default class AccountRepository extends MongoRepository<
  IAccountRepositoryConfiguration, 
  Account
  > implements IAccountRepository {
  constructor(
    @InjectModel(ModelName.Account) accountModel: Model<Account>,
  ) {
    super({
      model: accountModel,
    });
  }

  protected getFindQuery(params: IFindParams): FilterQuery<Account> {
    const idMatch = params.id ? { _id: new ObjectId(params.id) } : {};

    return {
      ...idMatch,
    };
  }

  protected mapToDefaultViewModel(document: Account): IAccountViewModel | Promise<IAccountViewModel> {
    return {
      id: document._id.toString(),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
