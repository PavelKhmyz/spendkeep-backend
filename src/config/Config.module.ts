import { Module, Provider } from '@nestjs/common';
import EnvironmentVariable from '../enums/EnvironmentVariable';
import { environmentVariableManager } from './EnvironmentVariableManager';
import ConfigType from './ConfigType';

const provideEnvironmentVariable = <ReturnType>(
  provide: symbol,
  environmentVariableName: EnvironmentVariable,
  parse?: (value: string) => ReturnType,
): Provider<ReturnType> => {
  return {
    provide,
    useFactory: async () => {
      const value = await environmentVariableManager.getSecret(environmentVariableName);

      return parse && value
        ? parse(value)
        : value as ReturnType;
    },
  };
};

@Module({
  providers: [
    provideEnvironmentVariable(ConfigType.DatabaseUrl, EnvironmentVariable.DatabaseUrl),
    provideEnvironmentVariable(ConfigType.Port, EnvironmentVariable.Port, parseInt),
    provideEnvironmentVariable(ConfigType.EmailPassword, EnvironmentVariable.EmailPassword),
    provideEnvironmentVariable(ConfigType.EmailUser, EnvironmentVariable.EmailUser),
    provideEnvironmentVariable(ConfigType.EmailPort, EnvironmentVariable.EmailPort, parseInt),
    provideEnvironmentVariable(ConfigType.EmailHost, EnvironmentVariable.EmailHost),
  ],
  exports: [
    ConfigType.DatabaseUrl,
    ConfigType.Port,
    ConfigType.EmailPassword,
    ConfigType.EmailUser,
    ConfigType.EmailPort,
    ConfigType.EmailHost,
  ],
})
export default class ConfigModule { }
