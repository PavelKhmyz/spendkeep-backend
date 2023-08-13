import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import BaseModelWithAccount from './BaseModelWithAccount';

export enum UserStatus {
  Pending = 'pending',
  Active = 'active',
}

@Schema({ timestamps: true, collection: ModelName.User })
export class User extends BaseModelWithAccount {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: true })
  isOwner: boolean;

  @Prop({ default: UserStatus.Active})
  status: UserStatus;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: false })
  avatarUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
