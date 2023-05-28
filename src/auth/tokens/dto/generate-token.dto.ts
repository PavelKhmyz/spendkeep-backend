import { IsString } from 'class-validator';

export class GenerateTokensDto {
  @IsString()
  readonly userName: string;

  @IsString()
  readonly sub: string;
}
