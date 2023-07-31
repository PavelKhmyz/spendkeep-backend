import { Module } from '@nestjs/common';
import ServicesModule from '../../services/Services.module';
import UserController from './UserController';
import TestEmailController from './TestEmailController';

@Module({
  imports: [ServicesModule],
  controllers: [
    UserController,
    TestEmailController,
  ],
  providers: [],
})
export default class WebApiControllerModule {}
