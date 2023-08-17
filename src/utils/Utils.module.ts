import { Module } from '@nestjs/common';
import { provideClass } from '../helpers/ModuleHelpers';
import Logger from './Logger';
import UtilType from './UtilType';
import BcriptHashUtils from './BcriptHashUtils';

@Module({
  imports: [],
  providers: [
    provideClass(UtilType.Logger, Logger),
    provideClass(UtilType.BcriptHashUtils, BcriptHashUtils),
  ],
  exports: [
    UtilType.Logger,
    UtilType.BcriptHashUtils,
  ],
})
export default class UtilsModule {}
