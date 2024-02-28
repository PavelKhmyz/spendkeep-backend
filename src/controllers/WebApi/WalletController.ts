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

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;
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
    const { id, accountId } = user;

    return this.walletService.create({
      userId: id,
      name: params.name,
    }, accountId);
  }

  @Get('find/:id')
  public async find(
    @Param('id') id: string,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.walletService.findById(id, user.accountId);
  }

  @Get('/user')
  public async getManyByUser(
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.walletService.findMany({ userId: user.id }, user.accountId);
  }

  @Get('/account')
  public async getManyByAccount(
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.walletService.findMany({ isPublic: true }, user.accountId);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: UpdateWalletDto,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    const findParams = { id };

    const updateParams = { 
      name: body.name, 
      isActive: body.isActive, 
      isPublic: body.isPublic,
    };

    return this.walletService.updateOne(findParams, updateParams, user.accountId);
  }
}
