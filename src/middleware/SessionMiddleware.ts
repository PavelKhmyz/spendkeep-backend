import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import * as session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import RedisStore from 'connect-redis';
import { RedisClientType } from 'redis';
import ConfigType from 'src/config/ConfigType';
import ClientType from 'src/clients/ClientType';

@Injectable()
export default class SessionMiddleware implements NestMiddleware {
  constructor(
    @Inject(ClientType.RedisClient) private readonly redisClient: RedisClientType,
    @Inject(ConfigType.CookieDomain) private readonly cookieDomain: string,
    @Inject(ConfigType.SessionSignSecret) private readonly sessionSignSecret: string,
  ) {}

  public use(request: Request, response: Response, next: NextFunction): void {
    const redisStore = new RedisStore({
      client: this.redisClient,
    });

    const sessionInstance = session({
      secret: this.sessionSignSecret,
      store: redisStore,
      resave: false,
      saveUninitialized: true,
      cookie: {
        domain: this.cookieDomain,
      },
    });

    sessionInstance(request, response, next);
  }
}
