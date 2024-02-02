import { Body, Controller, Delete, Inject, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import ServiceType from 'src/services/ServiceType';
import { ISessionService } from 'src/services/SessionService';
import { IsEmail, IsString } from 'class-validator';
import { promisify } from 'util';
import { Request, Response } from 'express';
import SenderMiddleware from 'src/middleware/SenderMiddleware';
import { noop } from 'lodash';

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
    readonly senderMiddleware: SenderMiddleware,
  ) {}

  @Post('/')
  public async login(
    @Body(new ValidationPipe()) params: LogInDto,
    @Req() request: Request,
    @Res() response: Response
  ) {
    await this.regenerateSession(request);

    const { userId, accountId } = await this.sessionService.create(params);

    request.session.userId = userId;
    request.session.accountId = accountId;

    await this.senderMiddleware.use(request, response, noop);
    
    response.send({});

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
