import { MiddlewareConsumer, Module } from '@nestjs/common';
import ServicesModule from '../../services/Services.module';
import UserController from './UserController';
import TestEmailController from './TestEmailController';
import AccountController from './AccountController';
import AccountRegistrationController from './AccountRegistrationController';
import EmailVerificationController from './EmailVerificationController';
import SessionMiddleware from 'src/middleware/SessionMiddleware';
import ClientsModule from 'src/clients/Clients.module';
import ConfigModule from 'src/config/Config.module';

@Module({
  imports: [ServicesModule, ClientsModule, ConfigModule],
  controllers: [
    UserController,
    TestEmailController,
    AccountController,
    AccountRegistrationController,
    EmailVerificationController,
  ],
  providers: [],
})
export default class WebApiControllerModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
