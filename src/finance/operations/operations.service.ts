import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Operation, OperationDocument } from './schemas/operation.schema';
import mongoose, { Model } from 'mongoose';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Injectable()
export class OperationsService {
  constructor(
    @InjectModel(Operation.name)
    private operationModel: Model<OperationDocument>,
  ) {}

  async create(createOperaationDto: CreateOperationDto) {
    return await new this.operationModel(createOperaationDto).save();
  }

  findOne(id: string | mongoose.Types.ObjectId) {
    return this.operationModel.findById(id);
  }

  findAll() {
    return this.operationModel.find();
  }

  update(id: string, updateOperationDto: UpdateOperationDto) {
    return this.operationModel.findByIdAndUpdate(id, updateOperationDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.operationModel.findByIdAndDelete(id);
  }
}
