import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import BaseModelWithAccount from './BaseModelWithAccount';
import mongoose, { ObjectId } from 'mongoose';
import { Currencies } from 'src/enums/Currencies';

@Schema({ timestamps: true, collection: ModelName.Expense })
export default class Expense extends BaseModelWithAccount {
  @Prop({ type: mongoose.Types.ObjectId, ref: ModelName.Wallet })
  wallet: ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: ModelName.Category })
  category: ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: ModelName.User })
  user: ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  sum: number;

  @Prop({ required: true })
  currency: Currencies;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
