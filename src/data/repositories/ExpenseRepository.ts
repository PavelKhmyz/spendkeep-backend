import { Injectable } from '@nestjs/common';
import MongoRepository from './MongoRepository';
import { InjectModel } from '@nestjs/mongoose';
import ModelName from 'src/data/models/enums/ModelName';
import { FilterQuery, Model} from 'mongoose';
import { ObjectId } from 'mongodb';
import Expense from 'src/data/models/Expense';
import { Currencies } from 'src/enums/Currencies';

export interface IExpenseViewModel {
  id: string;
  accountId: string;
  userId: string;
  walletId: string;
  categoryId: string;
  message: string;
  date: Date;
  sum: number;
  currency: Currencies;
  createdAt: Date;
  updatedAt: Date;
}

interface ICreateParams {
  accountId: string;
  userId: string;
  walletId: string;
  categoryId: string;
  message: string;
  date: Date;
  sum: number;
  currency: Currencies;
}

interface IFindParams {
  id?: string;
  accountId?: string;
  userId?: string;
  walletId?: string;
  categoryId?: string;
}

interface IUpdateParams {
  categoryId?: string;
  message?: string;
  date?: Date;
  sum?: number;
  currency?: Currencies;
}

interface IExpenseRepositoryConfiguration {
  viewModel: IExpenseViewModel;
  createParams: ICreateParams;
  findParams: IFindParams;
  updateParams: IUpdateParams;
}

export interface IExpenseRepository {
  createOne(params: ICreateParams, sessionId?: string): Promise<IExpenseViewModel>;
  findOneBy(params: IFindParams): Promise<IExpenseViewModel | null>;
  findMany(params: IFindParams): Promise<IExpenseViewModel[]>;
  updateOneBy(findParams: IFindParams, params: IUpdateParams): Promise<IExpenseViewModel>;
  deleteOneBy(params: IFindParams, sessionId?: string): Promise<void>;
}

@Injectable()
export default class CategoryRepository extends MongoRepository<
IExpenseRepositoryConfiguration, 
Expense
> implements IExpenseRepository {
  constructor(
    @InjectModel(ModelName.Expense) expenseModel: Model<Expense>
  ) {
    super({
      model: expenseModel,
      transformCreateParamsToModel(params: ICreateParams) {
        return {
          ...params,
          account: new ObjectId(params.accountId),
          user: new ObjectId(params.userId),
          wallet: new ObjectId(params.walletId),
          category: new ObjectId(params.categoryId),
        };
      },
    });
  }

  protected getFindQuery(params: IFindParams): FilterQuery<Expense> {
    const idMatch = params.id ? { _id: new ObjectId(params.id) } : {};
    const accountMatch = params.accountId ? { account: new ObjectId(params.accountId) } : {};
    const userMatch = params.userId ? { user: new ObjectId(params.userId) } : {};
    const walletMatch = params.walletId ? { wallet: new ObjectId(params.walletId) } : {};
    const categoryMatch = params.categoryId ? { category: new ObjectId(params.categoryId) } : {};

    return {
      ...idMatch,
      ...accountMatch,
      ...userMatch,
      ...walletMatch,
      ...categoryMatch,
    };
  }

  protected mapToDefaultViewModel(document: Expense): IExpenseViewModel | Promise<IExpenseViewModel> {
    return {
      id: document._id.toString(),
      accountId: document.account.toString(),
      userId: document.user.toString(),
      walletId: document.wallet.toString(),
      categoryId: document.category.toString(),
      message: document.message,
      date: document.date,
      sum: document.sum,
      currency: document.currency,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
