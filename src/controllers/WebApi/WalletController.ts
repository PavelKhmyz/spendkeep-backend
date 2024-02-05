import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Request } from 'express';
import { WebApiAuthGuard } from 'src/guards/WebApiAuthGuard';
import ServiceType from 'src/services/ServiceType';
import { IWalletService } from 'src/services/WalletService';

class WalletDto {
  @IsString()
  name: string;
}

enum FindParam {
  Account = 'account',
  User = 'user'
}

@Controller('wallet')
@UseGuards(WebApiAuthGuard)
export default class WalletController {
  constructor(
    @Inject(ServiceType.WalletService) private readonly walletService: IWalletService,
  ) {}

  @Post('/')
  public async create(
    @Req() request: Request,
    @Body(new ValidationPipe()) params: WalletDto,
  ) {
    const { userId, accountId} = request.session;

    await this.walletService.create({
      user: userId,
      account: accountId,
      name: params.name,
    });

    return {};
  }

  @Get('/:id')
  public async find(
    @Param('id') id: string,
  ) {
    return this.walletService.find(id);
  }

  @Get('/find-many/:type')
  public async findMany(
    @Param('type') type: FindParam,
    @Req() request: Request,
  ) {
    const { userId, accountId } = request.session;

    if (type === FindParam.Account) {
      return this.walletService.findMany({ accountId });
    }

    if (type === FindParam.User) {
      return this.walletService.findMany({ userId });
    }
  }
}
