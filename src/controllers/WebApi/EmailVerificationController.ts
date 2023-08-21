import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { IEmailVerificationService } from '../../services/EmailVerificationService';
import ServiceType from '../../services/ServiceType';

const MOCK_ID = 'qwerty123456'; //TODO:Change to info from sessions

class SendVerificationCodeDto {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
  @IsString()
  userName: string;
}

class VerifyEmailDto {
  @IsString()
  verificationCode: string;
}

@Controller('/emailVerification')
export default class EmailVerificationController {
  constructor(
    @Inject(ServiceType.EmailVerificationService) private readonly emailVerificationService: IEmailVerificationService,
  ) {}

  @Post('/')
  public async sendVerificationCode(
    @Body(new ValidationPipe()) body: SendVerificationCodeDto
  ) {
    await this.emailVerificationService.sendVerificationCode(body, MOCK_ID);

    return {};
  }

  @Post('/verify')
  public async verifyEmail(
    @Body(new ValidationPipe()) body: VerifyEmailDto
  ) {
    await this.emailVerificationService.verifyEmail(body, MOCK_ID);

    return {};
  }
}
