import { Module } from '@nestjs/common';
import ServicesModule from '../../services/Services.module';
import UserController from './UserController';

@Module({
  imports: [ServicesModule],
  controllers: [
    UserController,
  ],
  providers: [],
})
export default class WebApiControllerModule {}
