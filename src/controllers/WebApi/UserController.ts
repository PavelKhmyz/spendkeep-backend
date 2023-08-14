import { Body, Controller, Delete, Get, Inject, Param, Put, ValidationPipe } from '@nestjs/common';
import ServiceType from '../../services/ServiceType';
import { IUserService } from '../../services/UserService';
import { IsOptional, IsString, IsStrongPassword, IsUrl } from 'class-validator';

class UpdateUserDto {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

@Controller('users')
export default class UserController {
  constructor(
    @Inject(ServiceType.UserService) private readonly userService: IUserService,
  ){}

  @Get('/:id')
  public async findById(
    @Param('id') id: string,
  ) {
    return this.userService.find(id);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) params: UpdateUserDto,
  ) {
    return this.userService.update(id, params);
  }

  @Delete('/:id')
  public async deleteById(
    @Param('id') id: string,
  ) {
    await this.userService.delete(id);

    return {};
  }
}
