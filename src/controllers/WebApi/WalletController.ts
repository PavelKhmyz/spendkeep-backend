import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { WebApiUser } from 'src/decorators/WebApiUser';
import { IBaseAuthorizationInfo, WebApiAuthGuard } from 'src/guards/WebApiAuthGuard';
import ServiceType from 'src/services/ServiceType';
import { IWalletService } from 'src/services/WalletService';

class WalletDto {
  @IsString()
  name: string;
}

class UpdateWalletDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
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
    @WebApiUser() user: IBaseAuthorizationInfo,
    @Body(new ValidationPipe()) params: WalletDto,
  ) {
    const { id, accountId} = user;

    await this.walletService.create({
      user: id,
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
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    const { id, accountId } = user;

    if (type === FindParam.Account) {
      return this.walletService.findMany({ accountId });
    }

    if (type === FindParam.User) {
      return this.walletService.findMany({ userId: id });
    }
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: UpdateWalletDto,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    const updateQuery = { id, userId: user.id };

    const updateParams = { name: body.name, isActive: body.isActive };

    return this.walletService.update(updateQuery, updateParams);
  }
}
