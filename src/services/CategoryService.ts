import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository, ICategoryViewModel } from 'src/data/repositories/CategoryRepository';
import RepositoryType from 'src/data/repositories/RepositoryType';
import ServiceType from './ServiceType';
import { ICategoryValidationService } from './CategoryValidationService';

interface ICreateCategoryParams {
  name: string;
  color: string;
  iconName: string;
}

interface IFindCategoryParams {
  id?: string;
}

interface IUpdateCategoryParams {
  name?: string;
  color?: string;
  iconName?: string;
  isActive?: boolean;
}

export interface ICategoryService {
  create(params: ICreateCategoryParams, accountId: string, sessionId?: string): Promise<ICategoryViewModel>,
  findById(id: string, accountId: string): Promise<ICategoryViewModel>,
  findMany(params: IFindCategoryParams, accountId: string): Promise<ICategoryViewModel[]>,
  updateOne(
    findParams: IFindCategoryParams, 
    updateParams: IUpdateCategoryParams, 
    accountId: string): Promise<ICategoryViewModel>,
}

@Injectable()
export default class CategoriesService implements ICategoryService {
  constructor(
    @Inject(RepositoryType.CategoryRepository) private readonly categoryRepository: ICategoryRepository,
    @Inject(ServiceType.CategoryValidationService) private readonly categoryValidationService: ICategoryValidationService,
  ) {}

  public async create(params: ICreateCategoryParams, accountId: string, sessionId?: string): Promise<ICategoryViewModel> {
    await this.categoryValidationService.validateLimit(accountId);

    return this.categoryRepository.createOne({ ...params, accountId }, sessionId);
  }

  public async findById(id: string, accountId: string): Promise<ICategoryViewModel> {
    return this.categoryRepository.findOneBy({ id, accountId });
  }

  public async findMany(params: IFindCategoryParams, accountId: string): Promise<ICategoryViewModel[]> {
    return this.categoryRepository.findMany({ ...params, accountId });
  }

  public async updateOne(
    findParams: IFindCategoryParams, 
    updateParams: IUpdateCategoryParams, 
    accountId: string): Promise<ICategoryViewModel> {
    return this.categoryRepository.updateOneBy({ ...findParams, accountId }, updateParams);
  }
}
