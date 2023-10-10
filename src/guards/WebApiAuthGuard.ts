import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import 'express-session';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import AuthorizationError from 'src/errors/AuthorizationError';
import ServiceType from 'src/services/ServiceType';
import { IUserService } from 'src/services/UserService';
import AccessForbiddenError from 'src/errors/AccessForbiddenError';

declare module 'express-session' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface SessionData {
    userId: string;
    accountId: string;
  }
}

export interface IBaseAuthorizationInfo {
  id: string;
  accountId: string;
}

export interface IAuthorizedRequest<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: IBaseAuthorizationInfo;
}

@Injectable()
export class WebApiAuthGuard implements CanActivate {
  constructor(
    @Inject(ServiceType.UserService) private readonly userService: IUserService,
  ) {} 
  
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { userId, accountId } = request.session;

    if (!userId) {
      throw new AuthorizationError();
    }

    const user = await this.userService.find({ id: userId });

    if (!user) {
      throw new AccessForbiddenError('User is not active');
    }

    if (!user.isEmailVerified) {
      throw new AccessForbiddenError('Email is not verified');
    }

    request.user = { id: userId, accountId } as IBaseAuthorizationInfo;

    return true;
  }
}
