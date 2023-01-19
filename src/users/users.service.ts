import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { UserCreateDto, UserUpdateDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Pagination } from '../types/pagination';
import { Filters } from '../types/filters';
import { howManyPages } from 'src/utils/pagination';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(
    { offset, limit }: Pagination,
    { search, sort }: Filters,
  ): Promise<{
    data: Array<UserDocument>;
    total: number;
    pages: number;
  }> {
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

    const promises = [
      this.userModel
        .find(filter, {
          _id: 1,
        })
        .countDocuments()
        .lean<number>(),
      this.userModel
        .find<UserDocument>(filter, projection, options)
        .sort(sort.length > 0 ? sort : { updatedAt: 1 }),
    ];
    const [total, data] = await Promise.all(promises);

    return {
      data: data as Array<UserDocument>,
      total: total as number,
      pages: howManyPages(total as number, limit),
    };
  }

  getById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  getProfile(id: string): Promise<UserDocument> {
    const projection: ProjectionType<User> = { password: false };
    return this.userModel.findById(id, projection).exec();
  }
  findCandidate(email: string, login: string): Promise<UserDocument> {
    return this.userModel.findOne({ $or: [{ email }, { login }] }).exec();
  }

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  create(dto: UserCreateDto): Promise<UserDocument> {
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
