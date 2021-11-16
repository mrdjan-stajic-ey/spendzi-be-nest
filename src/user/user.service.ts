import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from 'src/dto/user/user.dto';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { USER_API } from 'src/api-errors/api-constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  //TODO: Implement the functionality of refresh token or rememberMeToken;
  async createUser(user: UserDTO): Promise<User | null> {
    //check if exists first
    const db_user = await this.userModel.findOne({ email: user.email }).exec();
    if (db_user !== null) throw USER_API.USER_EXISTS;
    const { password, ...result } = user;
    try {
      const hashedPswd = bcrypt.hashSync(password, 10);
      return await this.userModel.create({ ...result, password: hashedPswd });
    } catch (error) {
      console.error(USER_API.USER_CREATION_ERROR, error);
      throw USER_API.USER_CREATION_ERROR;
    }
  }

  async findOne(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username: username });
    if (user) {
      return user.toJSON();
    } else {
      return null;
    }
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userModel.findOne({ id: id });
    if (user) {
      return user.toJSON();
    } else {
      return null;
    }
  }
}
