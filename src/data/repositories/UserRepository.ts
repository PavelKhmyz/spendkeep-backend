import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelName from '../models/enums/ModelName';
import { User, UserStatus } from '../models/User';
import { FilterQuery, Model } from 'mongoose';
import MongoRepository from './MongoRepository';
import { ObjectId } from 'mongodb';

export interface IUserViewModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
  isOwner: boolean;
  isEmailVerified: boolean;
  status: UserStatus;
  avatarUrl?: string;
  password?: string;
}

interface ICreateParams {
  firstName: string;
  lastName: string;
  password: string;
  account: string;
  email: string;
}

interface IFindParams {
  id?: string;
}

interface IUpdateParams {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  account?: string;
  isOwner?: boolean;
  isEmailVerified?: boolean;
  status?: UserStatus;
}

export interface IUserRepository {
  createOne(params: ICreateParams): Promise<IUserViewModel>;
  findOneBy(params: IFindParams): Promise<IUserViewModel | null>;
  deleteOneBy(params: IFindParams): Promise<void>;
  updateOneBy(findParams: IFindParams, params: IUpdateParams): Promise<IUserViewModel>;
}

interface IUserRepositoryConfiguration {
  viewModel: IUserViewModel;
  createParams: ICreateParams;
  findParams: IFindParams;
  updateParams: IUpdateParams;
}

@Injectable()
export default class UserRepository extends MongoRepository<
  IUserRepositoryConfiguration,
  User
> implements IUserRepository {
  constructor(
    @InjectModel(ModelName.User) userModel: Model<User>,
  ) {
    super({
      model: userModel,
    });
  }

  protected getFindQuery(params: IFindParams): FilterQuery<User> {
    const idMatch = params.id ? { _id: new ObjectId(params.id) } : {};

    return {
      ...idMatch,
    };
  }

  protected mapToDefaultViewModel(document: User): IUserViewModel | Promise<IUserViewModel> {
    return {
      id: document._id.toString(),
      firstName: document.firstName,
      lastName: document.lastName,
      password: document.password,
      email: document.email,
      isEmailVerified: document.isEmailVerified,
      isOwner: document.isOwner,
      status: document.status,
      accountId: document.account.toString(),
      avatarUrl: document.avatarUrl,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
