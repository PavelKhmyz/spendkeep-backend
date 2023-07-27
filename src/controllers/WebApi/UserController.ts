import { Body, Controller, Delete, Get, Inject, Param, Post, ValidationPipe } from '@nestjs/common';
import ServiceType from '../../services/ServiceType';
import { IUserService } from '../../services/UserService';
import { IsOptional, IsString, IsStrongPassword, IsUrl } from 'class-validator';

class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

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

  @Post('/')
  public async create(
    @Body(new ValidationPipe()) params: CreateUserDto,
  ) {
    return this.userService.create({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: params.password,
      avatarUrl: params.avatarUrl,
    });
  }

  @Delete('/:id')
  public async deleteById(
    @Param('id') id: string,
  ) {
    await this.userService.delete(id);

    return {};
  }
}
