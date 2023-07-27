import { Injectable } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Finance, FinanceDocument } from './schemas/finance.schema';
import { Model } from 'mongoose';
import { EXPENSE_OPERATIONS, POPULATED_FIELDS } from './finance.constants';
import { OperationsService } from './operations/operations.service';
import { pathParser } from './finance.utils';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Finance.name) private financeModel: Model<FinanceDocument>,
    private operationService: OperationsService,
  ) {}

  async create(createFinanceDto: CreateFinanceDto) {
    return await new this.financeModel(createFinanceDto).save();
  }

  findAll() {
    const allDocuments = this.financeModel.find().populate(POPULATED_FIELDS);
    return allDocuments;
  }

  async findOne(date: number) {
    const targetDocument = await this.financeModel
      .findOne({ month: date })
      .populate(POPULATED_FIELDS);

    return targetDocument;
  }

  async update(date: number, updateFinanceDto: UpdateFinanceDto) {
    const targetDocument = await this.financeModel.findOne({ month: date });
    const operation = await this.operationService.create(updateFinanceDto);
    pathParser(updateFinanceDto.path, targetDocument).list.push(operation._id);
    await targetDocument.save();

    return this.calculateTotal(date);
  }

  async calculateTotal(date: number) {
    const targetDocument = await this.financeModel
      .findOne({ month: date })
      .populate(POPULATED_FIELDS);

    targetDocument.income.total = targetDocument.income.list.reduce(
      (accumulator: number, currentValue: any) =>
        accumulator + currentValue.sum,
      0,
    );

    EXPENSE_OPERATIONS.forEach(
      (e) =>
        (targetDocument.expense[e].total = targetDocument.expense[
          e
        ].list.reduce(
          (accumulator: number, currentValue: any) =>
            accumulator + currentValue.sum,
          0,
        )),
    );

    targetDocument.expense.total =
      targetDocument.income.total -
      EXPENSE_OPERATIONS.reduce(
        (accumulator, currentValue) =>
          accumulator + targetDocument.expense[currentValue].total,
        0,
      );

    targetDocument.saving.total = targetDocument.saving.list.reduce(
      (accumulator: number, currentValue: any) =>
        accumulator + currentValue.sum,
      0,
    );

    targetDocument.expense.total -= targetDocument.saving.total;

    return await targetDocument.save();
  }

  async remove(date: number) {
    return this.financeModel.findOneAndDelete({ month: date });
  }
}
