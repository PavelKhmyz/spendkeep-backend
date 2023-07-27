import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, IUserViewModel } from '../data/repositories/UserRepository';
import RepositoryType from '../data/repositories/RepositoryType';

export type IUserData = Omit<IUserViewModel, 'password'>;

interface ICreateUserParams {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  avatarUrl?: string;
}

export interface IUserService {
  create(params: ICreateUserParams): Promise<IUserData>;
  find(id: string): Promise<IUserData>;
  delete(id: string): Promise<void>
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(RepositoryType.UserRepository) private readonly userRepository: IUserRepository,
  ){}

  public async create(params: ICreateUserParams): Promise<IUserData> {
    const user = await this.userRepository.createOne(params);

    return this.mapUserViewModel(user);
  }

  public async find(id: string): Promise<IUserData> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

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
