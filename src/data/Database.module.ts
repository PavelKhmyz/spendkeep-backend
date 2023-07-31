import { MongooseModule } from '@nestjs/mongoose';
import ConfigModule from '../config/Config.module';
import ConfigType from '../config/ConfigType';

const DatabaseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigType.DatabaseUrl],
  useFactory: async (databaseUrl: string) => ({
    uri: databaseUrl,
  }),
});

export default DatabaseModule;
