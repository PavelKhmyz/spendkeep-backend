import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';
import rootPath from '../rootPath';
import EnvironmentVariable from '../enums/EnvironmentVariable';

export interface IEnvironmentVariableManager {
  getSecret(key: EnvironmentVariable): Promise<string>;
  getAll(): Promise<Record<string, string>>;
}

const pathToEnvFile = existsSync('.env')
  ? '.env'
  : path.join(rootPath, '.env');

config({ path: pathToEnvFile });

class SecretService {
  public async getAll() {
    return process.env;
  }

  public async getSecret(key: EnvironmentVariable) {
    return process.env[key];
  }
}

export const environmentVariableManagerFactory = (): IEnvironmentVariableManager => {
  return new SecretService();
};

export const environmentVariableManager = environmentVariableManagerFactory();
