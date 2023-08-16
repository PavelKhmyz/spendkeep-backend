import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import { IsString, IsStrongPassword, IsOptional, IsUrl } from 'class-validator';
import { IAccountRegistrationService } from '../../services/AccountRegistrationService';
import ServiceType from '../../services/ServiceType';

class CreateAccountDto {
  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

@Controller('/signUp')
export default class AccountRegistrationController {
  constructor(
    @Inject(ServiceType.AccountRegistrationService) private readonly accountRegistrationService: IAccountRegistrationService,
  ) {}

  @Post('/')
  public async register(@Body(new ValidationPipe()) params: CreateAccountDto) {
    await this.accountRegistrationService.register(params);

    return {};
  }
}
