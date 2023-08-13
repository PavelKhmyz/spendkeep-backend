import { Schema, SchemaFactory } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import BaseModel from './BaseModel';

@Schema({ timestamps: true, collection: ModelName.Account })
export class Account extends BaseModel {}

export const AccountSchema = SchemaFactory.createForClass(Account);
