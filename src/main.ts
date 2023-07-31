import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import ConfigType from './config/ConfigType';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = app.get(ConfigType.Port);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
