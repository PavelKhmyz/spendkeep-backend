import { Injectable } from '@nestjs/common';
import MongoRepository from './MongoRepository';
import { InjectModel } from '@nestjs/mongoose';
import ModelName from 'src/data/models/enums/ModelName';
import { FilterQuery, Model} from 'mongoose';
import { ObjectId } from 'mongodb';
import Category from 'src/data/models/Categories';

export interface ICategoryViewModel {
  id: string;
  accountId: string;
  name: string;
  color: string;
  iconName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ICreateParams {
  accountId: string;
  name: string;
  color: string;
  iconName: string;
}

interface IFindParams {
  id?: string;
  accountId?: string;
}

interface IUpdateParams {
  name?: string;
  color?: string;
  iconName?: string;
  isActive?: boolean;
}

interface ICategoryRepositoryConfiguration {
  viewModel: ICategoryViewModel;
  createParams: ICreateParams;
  findParams: IFindParams;
  updateParams: IUpdateParams;
}

export interface ICategoryRepository {
  createOne(params: ICreateParams, sessionId?: string): Promise<ICategoryViewModel>;
  findOneBy(params: IFindParams): Promise<ICategoryViewModel | null>;
  findMany(params: IFindParams): Promise<ICategoryViewModel[]>;
  updateOneBy(findParams: IFindParams, params: IUpdateParams): Promise<ICategoryViewModel>;
}

@Injectable()
export default class CategoryRepository extends MongoRepository<
ICategoryRepositoryConfiguration, 
Category
> implements ICategoryRepository {
  constructor(
    @InjectModel(ModelName.Category) categoryModel: Model<Category>
  ) {
    super({
      model: categoryModel,
      transformCreateParamsToModel(params: ICreateParams) {
        return {
          ...params,
          account: new ObjectId(params.accountId),
        };
      },
    });
  }

  protected getFindQuery(params: IFindParams): FilterQuery<Category> {
    const idMatch = params.id ? { _id: new ObjectId(params.id) } : {};
    const accountMatch = params.accountId ? { account: new ObjectId(params.accountId) } : {};

    return {
      ...idMatch,
      ...accountMatch,
    };
  }

  protected mapToDefaultViewModel(document: Category): ICategoryViewModel | Promise<ICategoryViewModel> {
    return {
      id: document._id.toString(),
      accountId: document.account.toString(),
      name: document.name,
      color: document.color,
      iconName: document.iconName,
      isActive: document.isActive,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
