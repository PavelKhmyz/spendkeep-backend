import { Body, Controller, Inject, Post, ValidationPipe } from '@nestjs/common';
import ServiceType from '../../services/ServiceType';
import { IEmailService } from '../../services/EmailService';
import { IsEmail, IsString } from 'class-validator';

class SendTestEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;
}

//Just to test email client
@Controller('/test-email')
export default class TestEmailController {
  constructor(
    @Inject(ServiceType.EmailService) private readonly emailService: IEmailService,
  ) {}

  @Post('/')
  public async sendTestEmail(
    @Body(new ValidationPipe()) body: SendTestEmailDto,
  ) {
    await this.emailService.sendTestEmail(body);

    return {};
  }
}
