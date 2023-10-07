import { Body, Controller, Delete, Inject, Post, Req, ValidationPipe } from '@nestjs/common';
import ServiceType from 'src/services/ServiceType';
import { ISessionService } from 'src/services/SessionService';
import { IsEmail, IsString } from 'class-validator';
import { promisify } from 'util';
import { Request } from 'express';

class LogInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@Controller('session')
export default class SessionController {
  constructor(
    @Inject(ServiceType.SessionService) private readonly sessionService: ISessionService,
  ) {}

  @Post('/')
  public async login(
    @Body(new ValidationPipe()) params: LogInDto,
    @Req() req: Request
  ) {
    await this.regenerateSession(req);

    const { userId, accountId } = await this.sessionService.create(params);

    req.session.userId = userId;
    req.session.accountId = accountId;

    return {};
  }

  @Delete('/')
  public async logout(
    @Req() req: Request,
  ) {
    await this.regenerateSession(req);

    return {};
  }

  protected async regenerateSession(request: Request) {
    await promisify(request.session.regenerate).bind(request.session)();
  }
}
