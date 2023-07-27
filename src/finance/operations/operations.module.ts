import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Operation, OperationSchema } from './schemas/operation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Operation.name, schema: OperationSchema },
    ]),
  ],
  providers: [OperationsService],
  exports: [OperationsService],
})
export class OperationsModule {}
