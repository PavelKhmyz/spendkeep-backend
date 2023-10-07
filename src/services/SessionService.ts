import { Inject, Injectable } from '@nestjs/common';
import UtilType from 'src/utils/UtilType';
import { IBcryptHashUtils } from 'src/utils/BcriptHashUtils';
import RepositoryType from 'src/data/repositories/RepositoryType';
import { IUserRepository } from 'src/data/repositories/UserRepository';
import AuthorizationError from 'src/errors/AuthorizationError';

export const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Incorrect email or password';

export interface ICreateSessionParams {
  email: string;
  password: string;
}

export interface ISessionInfo {
  userId: string;
  accountId: string;
}

export interface ISessionService {
  create(params: ICreateSessionParams): Promise<ISessionInfo>;
}

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @Inject(RepositoryType.UserRepository) private readonly userRepository: IUserRepository,
    @Inject(UtilType.BcriptHashUtils) private readonly bcriptHashUtils: IBcryptHashUtils,
  ) {}

  public async create(params: ICreateSessionParams): Promise<ISessionInfo> {
    const user = await this.userRepository.findOneBy({ email: params.email });
    
    if (!user || !user.password) {
      throw new AuthorizationError(INVALID_CREDENTIALS_ERROR_MESSAGE);
    }

    const doesPasswordMatch = await this.bcriptHashUtils.compare(params.password, user.password);

    if (!doesPasswordMatch) {
      throw new AuthorizationError(INVALID_CREDENTIALS_ERROR_MESSAGE);
    }

    return { userId: user.id, accountId: user.accountId };
  }
}
