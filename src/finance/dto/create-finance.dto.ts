import { IsNumber } from 'class-validator';

export class CreateFinanceDto {
  @IsNumber()
  readonly month: number;
}
