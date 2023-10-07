import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, IUserViewModel } from '../data/repositories/UserRepository';
import RepositoryType from '../data/repositories/RepositoryType';
import { UserStatus } from 'src/data/models/User';

export type IUserData = Omit<IUserViewModel, 'password'>;

interface ICreateUserParams {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  account: string;
  avatarUrl?: string;
}

interface IUpdateUserParams {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  avatarUrl?: string;
  account?: string;
  isOwner?: boolean;
  isEmailVerified?: boolean;
  status?: UserStatus;
}

interface IFindUserParams {
  id?: string;
  email?: string;
}

export interface IUserService {
  create(params: ICreateUserParams, sessionId?: string): Promise<IUserData>;
  find(params: IFindUserParams): Promise<IUserData>;
  update(id: string, params: IUpdateUserParams): Promise<IUserData>;
  delete(id: string): Promise<void>
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(RepositoryType.UserRepository) private readonly userRepository: IUserRepository,
  ){}

  public async create(params: ICreateUserParams, sessionId?: string): Promise<IUserData> {
    const user = await this.userRepository.createOne(params, sessionId);

    return this.mapUserViewModel(user);
  }

  public async find(params: IFindUserParams): Promise<IUserData> {
    const user = await this.userRepository.findOneBy(params);

    if (!user) {
      throw new Error('User not found');
    }

    return this.mapUserViewModel(user);
  }

  public async update(id: string, params: IUpdateUserParams ): Promise<IUserData> {
    const user = await this.userRepository.updateOneBy({ id }, params);

    return this.mapUserViewModel(user);
  }

  public async delete(id: string): Promise<void> {
    return this.userRepository.deleteOneBy({ id });
  }

  private mapUserViewModel(user: IUserViewModel): IUserData {
    const result = { ...user };

    delete result.password;

    return result;
  }
}
