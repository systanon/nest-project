import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDto, UserUpdateDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getAll(offset: number, limit: number, search: string): Promise<User[]> {
    const filter: Record<string, any> = {};
    if (search) {
      const regExp = new RegExp(search, 'ig');
      filter.$or = [
        { firstName: regExp },
        { login: regExp },
        { lastName: regExp },
        { email: regExp },
      ];
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
