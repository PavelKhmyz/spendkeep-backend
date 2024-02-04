import { MiddlewareConsumer, Module } from '@nestjs/common';
import ServicesModule from '../../services/Services.module';
import UserController from './UserController';
import AccountController from './AccountController';
import AccountRegistrationController from './AccountRegistrationController';
import EmailVerificationController from './EmailVerificationController';
import SessionMiddleware from 'src/middleware/SessionMiddleware';
import ClientsModule from 'src/clients/Clients.module';
import ConfigModule from 'src/config/Config.module';
import SessionController from 'src/controllers/WebApi/SessionController';
import SenderMiddleware from 'src/middleware/SenderMiddleware';

@Module({
  imports: [ServicesModule, ClientsModule, ConfigModule],
  controllers: [
    UserController,
    AccountController,
    AccountRegistrationController,
    EmailVerificationController,
    SessionController,
  ],
  providers: [SenderMiddleware],
})
export default class WebApiControllerModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SessionMiddleware).forRoutes('*');
    consumer.apply(SenderMiddleware).exclude('web-api/session', 'web-api/accounts').forRoutes('*');
  }
}
