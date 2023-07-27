// import { Module } from '@nestjs/common';
// import { FinanceService } from './finance.service';
// import { FinanceController } from './finance.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Finance, FinanceSchema } from './schemas/finance.schema';
// import { OperationsModule } from './operations/operations.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Finance.name, schema: FinanceSchema }]),
//     OperationsModule,
//   ],
//   controllers: [FinanceController],
//   providers: [FinanceService],
//   exports: [FinanceService],
// })
// export class FinanceModule {}
