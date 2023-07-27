import { IsNumber, IsString } from 'class-validator';

export class CreateOperationDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly path: string;
  @IsNumber()
  readonly sum: number;
  @IsString()
  readonly currency: string;
  @IsNumber()
  readonly date: number;
}
