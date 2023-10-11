import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { IAccountService } from '../../services/AccountService';
import ServiceType from '../../services/ServiceType';
import { IBaseAuthorizationInfo, WebApiAuthGuard } from 'src/guards/WebApiAuthGuard';
import { WebApiUser } from 'src/decorators/WebApiUser';

@Controller('account')
export default class AccountController {
  constructor(
    @Inject(ServiceType.AccountService) private readonly accountService: IAccountService,
  ) {}

  @Get('/')
  @UseGuards(WebApiAuthGuard)
  public async findCurrent(
    @WebApiUser() user: IBaseAuthorizationInfo
  ) {
    return this.accountService.find(user.id);
  }
}
