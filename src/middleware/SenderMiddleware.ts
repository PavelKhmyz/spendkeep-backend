import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { objectToBase64Json } from 'src/helpers/objectToBase64Json';
import ServiceType from 'src/services/ServiceType';
import { IUserService } from 'src/services/UserService';

@Injectable()
export default class SenderMiddleware implements NestMiddleware {
  constructor(
    @Inject(ServiceType.UserService) private readonly userService: IUserService,
  ) {}

  public async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { userId } = request.session;

    if (!userId) {
      next();
    }

    const user = await this.userService.find({ id: userId });

    if (!user) {
      next();
    }
    
    const encodedUser = objectToBase64Json({
      accountId: user.accountId,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
    });

    response.setHeader('x-spendkeep-user', encodedUser);

    next();
  }
}
