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

@Injectable()
export class NotationsService {
  constructor(
    @InjectModel(Notation.name) private notationModel: Model<NotationDocument>,
  ) {}

  getAll({ offset, limit }: Pagination, search: string): Promise<Notation[]> {
    const filter: Record<string, any> = {};
    if (search) {
      const regExp = new RegExp(search, 'ig');
      filter.$or = [{ title: regExp }, { description: regExp }];
    }
    const options = { skip: offset, limit };
    const projection = {
      __v: 0,
    };
    return this.notationModel.find(filter, projection, options).exec();
  }

  getById(id: string): Promise<Notation> {
    return this.notationModel.findById(id).exec();
  }

  create(dto: NotationCreateDto): Promise<Notation> {
    const newNotation = new this.notationModel(dto);
    return newNotation.save();
  }

  remove(id: string) {
    return this.notationModel.findByIdAndRemove(id);
  }

  async replace(_id: string, dto: NotationReplaceDto): Promise<Notation> {
    const filter = { _id };
    return this.notationModel.findOneAndReplace(filter, dto, { upsert: true });
  }

  async update(id: string, dto: NotationUpdateDto): Promise<Notation> {
    return this.notationModel.findByIdAndUpdate(id, dto, { new: true });
  }
}
