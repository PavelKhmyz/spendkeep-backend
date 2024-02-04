import { Body, Controller, Inject, Post, Req, ValidationPipe } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { IEmailVerificationService } from '../../services/EmailVerificationService';
import ServiceType from '../../services/ServiceType';
import { Request } from 'express';

class SendVerificationCodeDto {
  @IsEmail()
  email: string;
  @IsString()
  userName: string;
}

class VerifyEmailDto {
  @IsString()
  verificationCode: string;
}

@Controller('/email-verification')
export default class EmailVerificationController {
  constructor(
    @Inject(ServiceType.EmailVerificationService) private readonly emailVerificationService: IEmailVerificationService,
  ) {}

  @Post('/')
  public async sendVerificationCode(
    @Body(new ValidationPipe()) body: SendVerificationCodeDto,
    @Req() request: Request,
  ) {
    const { userId } = request.session;

    await this.emailVerificationService.sendVerificationCode(body, userId);

    return {};
  }

  @Post('/verify')
  public async verifyEmail(
    @Body(new ValidationPipe()) body: VerifyEmailDto,
    @Req() request: Request,
  ) {
    const { userId } = request.session;

    await this.emailVerificationService.verifyEmail(body, userId);

    return {};
  }
}
