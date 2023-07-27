import { ClassProvider, Provider } from '@nestjs/common';
import { isDevelopment, isTest } from '../enums/Environment';

export const provideClass = <Type extends ClassProvider['useClass'], TypeForLocalhost extends ClassProvider['useClass']>(
  provide: symbol,
  useClass: Type,
  useClassForLocalhost?: TypeForLocalhost,
): Provider<Type | TypeForLocalhost> => {
  return {
    provide,
    useClass: isDevelopment() || isTest()
      ? useClassForLocalhost || useClass
      : useClass,
  };
};
