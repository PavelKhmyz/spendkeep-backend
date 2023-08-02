import { Body, Controller, Delete, Get, Inject, Param, Post, ValidationPipe } from '@nestjs/common';
import ServiceType from '../../services/ServiceType';
import { IEmailService } from '../../services/EmailService';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { IRedisService } from 'src/services/RedisService';

class SendTestEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;
}

class SendTestRedisDto{
  storedData: {
    [key: string]: string;
  };

  @IsOptional()
  @IsNumber()
  expire: number;  
}

//Just to test email client
@Controller('/test-email')
export default class TestEmailController {
  constructor(
    @Inject(ServiceType.EmailService) private readonly emailService: IEmailService,
    @Inject(ServiceType.RedisService) private readonly redisService: IRedisService,
  ) {}

  @Post('/')
  public async sendTestEmail(
    @Body(new ValidationPipe()) body: SendTestEmailDto,
  ) {
    await this.emailService.sendTestEmail(body);

    return {};
  }

  @Post('/redis')
  public async redisCreate(
    @Body(new ValidationPipe()) body: SendTestRedisDto
  ) {

    return await this.redisService.create(Object.keys(body.storedData)[0], Object.values(body.storedData)[0], body.expire);
  }

  @Get('/:key')
  public async redisFind(
    @Param('key') key: string
  ) {
    return await this.redisService.find(key);
  }

  @Delete('/:key')
  public async redisRemove(
    @Param('key') key: string
  ) {
    return await this.redisService.delete(key);
  }
}
