import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { WebApiUser } from 'src/decorators/WebApiUser';
import { Currencies } from 'src/enums/Currencies';
import { IBaseAuthorizationInfo, WebApiAuthGuard } from 'src/guards/WebApiAuthGuard';
import { IExpenseService } from 'src/services/ExpenseService';
import ServiceType from 'src/services/ServiceType';

class CreateExpenseDto {
  @IsString()
  walletId: string;

  @IsString()
  categoryId: string;

  @IsString()
  message: string;

  @IsDate()
  date: Date;

  @IsNumber()
  sum: number;

  @IsEnum(Currencies)
  currency: Currencies;
}

class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsNumber()
  sum?: number;

  @IsOptional()
  @IsEnum(Currencies)
  currency?: Currencies;
}

class FindExpenseDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  walletId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

@Controller('expense')
@UseGuards(WebApiAuthGuard)
export default class ExpenseController {
  constructor(
    @Inject(ServiceType.ExpenseService) private readonly expenseService: IExpenseService,
  ) {}

  @Post('/')
  public async create(
    @WebApiUser() user: IBaseAuthorizationInfo,
    @Body(new ValidationPipe()) body: CreateExpenseDto,
  ) {
    return this.expenseService.create({
      userId: user.id,
      walletId: body.walletId,
      categoryId: body.categoryId,
      message: body.message,
      date: body.date,
      sum: body.sum,
      currency: body.currency,
    }, user.accountId);
  }

  @Get('/:id')
  public async find(
    @Param('id') id: string,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.expenseService.findById(id, user.accountId);
  }

  @Get('/')
  public async findMany(
    @Query(new ValidationPipe()) query: FindExpenseDto,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.expenseService.findMany({
      userId: query?.userId,
      walletId: query?.walletId,
      categoryId: query?.categoryId,
    }, user.accountId);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: UpdateExpenseDto,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.expenseService.updateOne(id, {
      categoryId: body?.categoryId,
      message: body?.message,
      date: body?.date,
      sum: body?.sum,
      currency: body?.currency,
    }, user.accountId);
  }

  @Delete('/:id')
  public async delete(
    @Param('id') id: string,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    await this.expenseService.deleteById(id, user.accountId);

    return {};
  }
}
