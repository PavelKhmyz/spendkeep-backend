import { Module } from '@nestjs/common';
import { provideClass } from '../helpers/ModuleHelpers';
import Logger from './Logger';
import UtilType from './UtilType';

@Module({
  imports: [],
  providers: [
    provideClass(UtilType.Logger, Logger),
  ],
  exports: [
    UtilType.Logger,
  ],
})
export default class UtilsModule {}
