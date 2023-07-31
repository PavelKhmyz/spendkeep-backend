// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { FinanceService } from './finance.service';
// import { CreateFinanceDto } from './dto/create-finance.dto';
// import { UpdateFinanceDto } from './dto/update-finance.dto';
// import { UpdateOperationDto } from './operations/dto/update-operation.dto';
// import { OperationsService } from './operations/operations.service';
// import * as moment from 'moment-timezone';

// @Controller('finance')
// export class FinanceController {
//   constructor(
//     private readonly financeService: FinanceService,
//     private readonly operationService: OperationsService,
//   ) {}

//   @Post('newMonth')
//   create(@Body() createFinanceDto: CreateFinanceDto) {
//     return this.financeService.create(createFinanceDto);
//   }

//   @Get('getAll')
//   findAll() {
//     return this.financeService.findAll();
//   }

//   @Get(':date')
//   findOne(@Param('date') date: string) {
//     return this.financeService.findOne(+date);
//   }

//   @Patch(':date')
//   update(
//     @Param('date') date: string,
//     @Body() updateFinanceDto: UpdateFinanceDto,
//   ) {
//     return this.financeService.update(+date, updateFinanceDto);
//   }
//   @Patch('updateOperation/:id')
//   async updateOperation(
//     @Param('id') id: string,
//     @Body() updateOperationDto: UpdateOperationDto,
//   ) {
//     const updatedOperation = await this.operationService.update(
//       id,
//       updateOperationDto,
//     );
//     const timeStamp = moment(updatedOperation.date)
//       .tz(process.env.TIME_ZONE)
//       .startOf('month')
//       .format('x');
//     this.financeService.calculateTotal(+timeStamp);
//     return updatedOperation;
//   }

//   @Delete(':date')
//   remove(@Param('date') date: string) {
//     return this.financeService.remove(+date);
//   }

//   @Delete('removeOperation/:id')
//   async removeOperation(@Param('id') id: string) {
//     return await this.operationService.remove(id);
//   }
// }
