import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotationCreateDto,
  NotationUpdateDto,
  NotationReplaceDto,
} from './dto/notation.dto';
import { Notation, NotationDocument } from './schemas/notation.schema';
import { Pagination } from '../types/pagination';
import { Filters } from '../types/filters';

const howManyPages = (total: number, limit: number) => Math.ceil(total / limit);

@Injectable()
export class NotationsService {
  constructor(
    @InjectModel(Notation.name) private notationModel: Model<NotationDocument>,
  ) {}

  async getAll(
    userId: string,
    { offset, limit }: Pagination,
    { search }: Filters,
  ): Promise<{
    data: Array<Notation>;
    total: number;
    pages: number;
  }> {
    const filter: Record<string, any> = { userId };
    if (search.length > 0) {
      filter.$or = search.map(({ field, value }) => ({
        [field]: new RegExp(value, 'ig'),
      }));
    }
    const options = { skip: offset, limit };
    const projection = {
      __v: 0,
    };

    const promises: Array<any> = [
      this.notationModel
        .find(filter, {
          _id: 1,
        })
        .countDocuments()
        .lean(),
      this.notationModel
        .find(filter, projection, options)
        .sort({ createdAt: 1 }),
    ];
    const [total, data] = await Promise.all(promises);

    return {
      data: data as Array<Notation>,
      total: total as number,
      pages: howManyPages(total as number, limit),
    };
  }

  getById(userId: string, _id: string): Promise<Notation> {
    return this.notationModel.findOne({ _id, userId }).exec();
  }

  create(userId: string, dto: NotationCreateDto): Promise<Notation> {
    const newNotation = new this.notationModel({ ...dto, userId });
    return newNotation.save();
  }

  remove(userId: string, _id: string) {
    return this.notationModel.findOneAndRemove({ _id, userId });
  }

  async replace(
    userId: string,
    _id: string,
    dto: NotationReplaceDto,
  ): Promise<Notation> {
    const filter = { _id, userId };
    return this.notationModel.findOneAndReplace(filter, dto, { upsert: true });
  }

  async update(
    userId: string,
    _id: string,
    dto: NotationUpdateDto,
  ): Promise<Notation> {
    return this.notationModel.findOneAndUpdate({ _id, userId }, dto);
  }
}
