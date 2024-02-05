import { Body, Controller, Inject, Post, Req, ValidationPipe } from '@nestjs/common';
import { Body, Controller, Inject, Post, Req, ValidationPipe } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { IEmailVerificationService } from 'src/services/EmailVerificationService';
import ServiceType from 'src/services/ServiceType';
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
    @Body(new ValidationPipe()) body: SendVerificationCodeDto,
    @Req() request: Request,
  ) {
    const { userId } = request.session;

    await this.emailVerificationService.sendVerificationCode({
      email: body.email,
      userName: body.userName,
    }, userId);

    return {};
  }

  @Post('/verify')
  public async verifyEmail(
    @Body(new ValidationPipe()) body: VerifyEmailDto,
    @Req() request: Request,
    @Body(new ValidationPipe()) body: VerifyEmailDto,
    @Req() request: Request,
  ) {
    const { userId } = request.session;

    await this.emailVerificationService.verifyEmail({
      verificationCode: body.verificationCode,
    }, userId);

    return {};
  }
}
