import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDto, UserUpdateDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Pagination } from '../types/pagination';
import { Filters } from '../types/filters';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getAll({ offset, limit }: Pagination, { search }: Filters): Promise<User[]> {
    const filter: Record<string, any> = {};
    if (search.length > 0) {
      filter.$or = search.map(({ field, value }) => ({
        [field]: new RegExp(value, 'ig'),
      }));
    }
    const options = { skip: offset, limit };
    const projection = {
      __v: 0,
    };
    return this.userModel.find(filter, projection, options).exec();
  }

  getById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  findCandidate(email: string, login: string): Promise<User> {
    return this.userModel.findOne({ $or: [{ email }, { login }] }).exec();
  }

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  create(dto: UserCreateDto): Promise<User> {
    const newUser = new this.userModel(dto);
    return newUser.save();
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }

  async update(id: string, dto: UserUpdateDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true });
  }
}
