import mongoose, { ObjectId } from 'mongoose';
import BaseModel from './BaseModel';
import { Prop } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';

export default class BaseModelWithAccount extends BaseModel {
  @Prop({ type: mongoose.Types.ObjectId, ref: ModelName.Account })
  account: ObjectId;
}
