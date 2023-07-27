import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OperationDocument = Operation & Document;

@Schema()
export class Operation {
  @Prop()
  title: string;
  @Prop()
  path: string;
  @Prop()
  sum: number;
  @Prop()
  currency: string;
  @Prop()
  date: number;
}

export const OperationSchema = SchemaFactory.createForClass(Operation);
