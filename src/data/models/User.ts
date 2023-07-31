import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseModel from './BaseModel';
import ModelName from './enums/ModelName';

@Schema({ timestamps: true, collection: ModelName.User })
export class User extends BaseModel {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: false })
  avatarUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
