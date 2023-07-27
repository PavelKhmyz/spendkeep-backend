import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelName from '../models/enums/ModelName';
import { User } from '../models/User';
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
  avatarUrl?: string;
  password?: string;
}

interface ICreateParams {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

interface IFindParams {
  id?: string;
}

export interface IUserRepository {
  createOne(params: ICreateParams): Promise<IUserViewModel>;
  findOneBy(params: IFindParams): Promise<IUserViewModel | null>;
  deleteOneBy(params: IFindParams): Promise<void>;
}

interface IUserRepositoryConfiguration {
  viewModel: IUserViewModel;
  createParams: ICreateParams;
  findParams: IFindParams;
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
      avatarUrl: document.avatarUrl,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}