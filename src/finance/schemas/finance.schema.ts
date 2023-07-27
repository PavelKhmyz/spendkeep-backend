import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Expense } from './expense.schema';
import { Salary } from './salary.schema';

export type FinanceDocument = Finance & Document;

@Schema()
export class Finance {
  @Prop({ required: true })
  month: number;
  @Prop({ type: Salary, default: new Salary() })
  income: Salary;
  @Prop({ type: Expense, default: new Expense() })
  expense: Expense;
  @Prop({ type: Salary, default: new Salary() })
  saving: Salary;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);
