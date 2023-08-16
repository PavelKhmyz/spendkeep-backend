import { Module } from '@nestjs/common';
import ServicesModule from '../../services/Services.module';
import UserController from './UserController';
import TestEmailController from './TestEmailController';
import AccountController from './AccountController';
import AccountRegistrationController from './AccountRegistrationController';

@Module({
  imports: [ServicesModule],
  controllers: [
    UserController,
    TestEmailController,
    AccountController,
    AccountRegistrationController,
  ],
  providers: [],
})
export default class WebApiControllerModule {}
