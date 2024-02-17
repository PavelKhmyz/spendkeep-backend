import { MongooseModule } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import { UserSchema } from './User';
import { AccountSchema } from './Account';
import { WalletSchema } from './Wallet';
import { CategorySchema } from './Categories';

const ModelsModule = MongooseModule.forFeature([
  { name: ModelName.User, schema: UserSchema },
  { name: ModelName.Account, schema: AccountSchema },
  { name: ModelName.Wallet, schema: WalletSchema },
  { name: ModelName.Category, schema: CategorySchema},
]);

export default ModelsModule;
