import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }
  async find(query: FindUserDto): Promise<UserDocument> {
    return await this.userModel.findOne(query).exec();
  }
  async remove(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
