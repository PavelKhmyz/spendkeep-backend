import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

export default class BaseModel {
  _id: ObjectId;

  @Prop({ required: false })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}
