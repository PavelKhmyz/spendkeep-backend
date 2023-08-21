import { Body, Controller, Delete, Get, Inject, Param, Post, ValidationPipe } from '@nestjs/common';
import ServiceType from '../../services/ServiceType';
import { IEmailService } from '../../services/EmailService';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { IRedisService, RedisTimeUnit } from '../../services/RedisService';

class SendTestEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;
}

class ExpireInDto {
  @IsEnum(RedisTimeUnit)
  timeUnit: RedisTimeUnit;

  @IsNumber()
  timeValue: number;
}

class SendTestRedisDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsOptional()
  expireIn: ExpireInDto;
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
    await this.emailService.send(body);

    return {};
  }

  @Post('/redis')
  public async redisCreate(
    @Body(new ValidationPipe()) body: SendTestRedisDto
  ) {
    await this.redisService.set(body.key, body.value, body.expireIn);

    return {};
  }

  @Get('/:key')
  public async redisFind(
    @Param('key') key: string
  ) {
    return this.redisService.getOne(key);
  }

  // Post just for test
  @Post('/getMany') 
  public async getMany(
    @Body(new ValidationPipe()) body: string[]
  ) {
    return this.redisService.getMany(body);
  }

  @Delete('/:key')
  public async redisRemove(
    @Param('key') key: string
  ) {
    await this.redisService.delete(key);

    return {};
  }
}
