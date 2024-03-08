import { Inject, Injectable } from '@nestjs/common';
import { IExpenseRepository, IExpenseViewModel } from 'src/data/repositories/ExpenseRepository';
import RepositoryType from 'src/data/repositories/RepositoryType';
import { Currencies } from 'src/enums/Currencies';
import NotFoundError from 'src/errors/NotFoundError';

interface ICreateExpenseParams {
  userId: string;
  walletId: string;
  categoryId: string;
  message: string;
  date: Date;
  sum: number;
  currency: Currencies;
}

interface IUpdateExpenseParams {
  categoryId?: string;
  message?: string;
  date?: Date;
  sum?: number;
  currency?: Currencies;
}

interface IFindExpenseParams {
  id?: string;
  accountId?: string;
  userId?: string;
  walletId?: string;
  categoryId?: string;
}

export interface IExpenseService{
  create(params: ICreateExpenseParams, accountId: string, sessionId?: string): Promise<IExpenseViewModel>;
  findById(id: string, accountId: string): Promise<IExpenseViewModel>;
  findMany(params: IFindExpenseParams, accountId: string): Promise<IExpenseViewModel[]>;
  updateOne(id: string, params:IUpdateExpenseParams, accountId: string): Promise<IExpenseViewModel>;
  deleteById(id: string, accountId: string): Promise<void>;
}

@Injectable()
export default class ExpenseService implements IExpenseService {
  constructor(
    @Inject(RepositoryType.ExpenseRepository) private readonly expenseRepository: IExpenseRepository,
  ) {}

  public async create(params: ICreateExpenseParams, accountId: string, sessionId?: string): Promise<IExpenseViewModel> {
    return this.expenseRepository.createOne({ ...params, accountId }, sessionId);
  }

  public async findById(id: string, accountId: string): Promise<IExpenseViewModel> {
    return this.expenseRepository.findOneBy({ id, accountId });
  }

  public async findMany(params: IFindExpenseParams, accountId: string): Promise<IExpenseViewModel[]> {
    return this.expenseRepository.findMany({ ...params, accountId });
  }

  public async updateOne(id: string, params: IUpdateExpenseParams, accountId: string): Promise<IExpenseViewModel> {
    const expense = await this.expenseRepository.updateOneBy({ id, accountId }, params);

    if (!expense) {
      throw new NotFoundError('Expense not found');
    }

    return expense;
  }

  public async deleteById(id: string, accountId: string): Promise<void> {
    return this.expenseRepository.deleteOneBy({ id, accountId });
  }
}
