import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import ServicesModule from './services/Services.module';
import RepositoriesModule from './data/repositories/Repositories.module';
import { RouterModule } from '@nestjs/core';
import WebApiControllerModule from './controllers/WebApi/WebApiControllers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL, { dbName: 'nest' }),
    ServicesModule,
    RepositoriesModule,
    WebApiControllerModule,
    RouterModule.register([
      {
        path: 'web-api',
        module: WebApiControllerModule,
      },
    ]),
  ],
})
export class AppModule {}
