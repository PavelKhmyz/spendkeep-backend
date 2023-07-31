import { MiddlewareConsumer, Module } from '@nestjs/common';
import ConfigModule from './config/Config.module';
import ServicesModule from './services/Services.module';
import RepositoriesModule from './data/repositories/Repositories.module';
import { RouterModule } from '@nestjs/core';
import WebApiControllerModule from './controllers/WebApi/WebApiControllers.module';
import ClientsModule from './clients/Clients.module';
import LoggerMiddleware from './middleware/LoggerMiddleware';
import UtilsModule from './utils/Utils.module';

@Module({
  imports: [
    ConfigModule,
    ServicesModule,
    RepositoriesModule,
    WebApiControllerModule,
    ClientsModule,
    UtilsModule,
    RouterModule.register([
      {
        path: 'web-api',
        module: WebApiControllerModule,
      },
    ]),
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
