import { MongooseModule } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import { UserSchema } from './User';
import { AccountSchema } from './Account';

const ModelsModule = MongooseModule.forFeature([
  { name: ModelName.User, schema: UserSchema },
  { name: ModelName.Account, schema: AccountSchema },
]);

export default ModelsModule;
