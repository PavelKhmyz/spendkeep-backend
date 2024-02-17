import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import BaseModelWithAccount from './BaseModelWithAccount';

@Schema({ timestamps: true, collection: ModelName.Category })
export default class Category extends BaseModelWithAccount {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  iconName: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
