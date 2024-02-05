import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseModelWithAccount from './BaseModelWithAccount';
import ModelName from './enums/ModelName';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ timestamps: true, collection: ModelName.Wallet })
export class Wallet extends BaseModelWithAccount {

  @Prop({ type: mongoose.Types.ObjectId, ref: ModelName.User, required: true })
  user: ObjectId;

  @Prop({ required: true })
  name: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
