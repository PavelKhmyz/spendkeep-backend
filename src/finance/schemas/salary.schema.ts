import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
export class Salary {
  @Prop({ default: 0 })
  total: number;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Operation' }],
    default: [],
  })
  list: mongoose.Types.ObjectId[];
}
