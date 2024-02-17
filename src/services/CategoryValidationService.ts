import { Inject, Injectable } from '@nestjs/common';
import BaseValidationService from './BaseValidationService';
import RepositoryType from 'src/data/repositories/RepositoryType';
import { ICategoryRepository } from 'src/data/repositories/CategoryRepository';
import ValidationError from 'src/errors/ValidationError';

const ACCOUNT_CATEGORY_LIMIT = 20;

export interface ICategoryValidationService {
  validateLimit(accountId: string): Promise<ValidationError | null>
}

@Injectable()
export default class CategoryValidationService extends BaseValidationService implements ICategoryValidationService{
  constructor(
    @Inject(RepositoryType.CategoryRepository) private readonly categoryRepository: ICategoryRepository,
  ) {
    super();
  }

  public async validateLimit(accountId: string): Promise<ValidationError | null> {
    return this.runValidationInChain([
      this.validateWalletLimit(accountId),
    ]);
  }

  protected async validateWalletLimit(accountId: string): Promise<() => ValidationError | null> {
    const userCategories = await this.categoryRepository.findMany({ accountId });

    return () => userCategories.length >= ACCOUNT_CATEGORY_LIMIT ? new ValidationError('Category`s limit exceeded') : null;
  }
}
