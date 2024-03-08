import { MongooseModule } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import { UserSchema } from './User';
import { AccountSchema } from './Account';
import { WalletSchema } from './Wallet';
import { CategorySchema } from './Categories';
import { ExpenseSchema } from './Expense';

const ModelsModule = MongooseModule.forFeature([
  { name: ModelName.User, schema: UserSchema },
  { name: ModelName.Account, schema: AccountSchema },
  { name: ModelName.Wallet, schema: WalletSchema },
  { name: ModelName.Category, schema: CategorySchema},
  { name: ModelName.Expense, schema: ExpenseSchema},
]);

export default ModelsModule;
