import { MongooseModule } from '@nestjs/mongoose';
import ModelName from './enums/ModelName';
import { UserSchema } from './User';

const ModelsModule = MongooseModule.forFeature([
  { name: ModelName.User, schema: UserSchema },
]);

export default ModelsModule;
