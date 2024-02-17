import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import ServiceType from 'src/services/ServiceType';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { IBaseAuthorizationInfo, WebApiAuthGuard } from 'src/guards/WebApiAuthGuard';
import { WebApiUser } from 'src/decorators/WebApiUser';
import { ICategoryService } from 'src/services/CategoryService';

class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsString()
  iconName: string;
}

class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  iconName: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

@Controller('categories')
@UseGuards(WebApiAuthGuard)
export default class CategoryController {
  constructor(
    @Inject(ServiceType.CategoriesService) private readonly categoryService: ICategoryService,
  ) {}

  @Post('/')
  public async create(
    @Body(new ValidationPipe()) body: CreateCategoryDto,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.categoryService.create({
      name: body.name,
      color: body.color,
      iconName: body.iconName,
    }, user.accountId);
  }

  @Get('/:id')
  public async findOne(
    @Param('id') id: string,
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.categoryService.findById(id, user.accountId);
  }

  @Get('/')
  public async findMany(
    @WebApiUser() user: IBaseAuthorizationInfo,
  ) {
    return this.categoryService.findMany({}, user.accountId);
  }

  @Put('/:id')
  public async updateOne(
    @Param('id') id: string,
    @WebApiUser() user: IBaseAuthorizationInfo,
    @Body(new ValidationPipe()) body: UpdateCategoryDto,
  ) {
    return this.categoryService.updateOne(
      { id }, 
      { 
        name: body.name, 
        color: body.color, 
        iconName: body.iconName, 
        isActive: body.isActive,
      }, user.accountId,
    );
  }
}
