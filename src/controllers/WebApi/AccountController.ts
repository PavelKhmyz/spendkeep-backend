import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { IAccountService } from '../../services/AccountService';
import ServiceType from '../../services/ServiceType';

@Controller('account')
export default class AccountController {
  constructor(
    @Inject(ServiceType.AccountService) private readonly accountService: IAccountService,
  ) {}

  @Post('/')
  public async create() {
    return this.accountService.create();
  }

  @Get('/:id')
  public async findById(
    @Param('id') id: string
  ) {
    return this.accountService.find(id);
  }
}
