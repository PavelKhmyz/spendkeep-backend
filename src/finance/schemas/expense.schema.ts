// import { Prop, Schema } from '@nestjs/mongoose';
// import mongoose from 'mongoose';

// @Schema({ _id: false })
// export class ExpenseOperation {
//   @Prop({ default: 0 })
//   total: number;
//   @Prop({
//     type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Operation' }],
//     default: [],
//   })
//   list: mongoose.Types.ObjectId[];
// }

// @Schema({ _id: false })
// export class Expense {
//   @Prop({ default: 0 })
//   total: number;
//   @Prop({ default: new ExpenseOperation() })
//   communication: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   home: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   credits: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   food: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   vehicle: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   pets: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   transit: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   beauty: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   eatingOut: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   entertainment: ExpenseOperation;
//   @Prop({ default: new ExpenseOperation() })
//   unexpectedExperses: ExpenseOperation;
// }
