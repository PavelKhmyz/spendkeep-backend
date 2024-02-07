import { MongooseModule } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import { UserSchema } from './User';
import { AccountSchema } from './Account';
import { WalletSchema } from './Wallet';

const ModelsModule = MongooseModule.forFeature([
  { name: ModelName.User, schema: UserSchema },
  { name: ModelName.Account, schema: AccountSchema },
  { name: ModelName.Wallet, schema: WalletSchema },
]);

export default ModelsModule;
