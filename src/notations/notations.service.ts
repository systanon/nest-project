import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotationCreateDto,
  NotationUpdateDto,
  NotationReplaceDto,
} from './dto/notation.dto';
import { Notation, NotationDocument } from './schemas/notation.schema';

@Injectable()
export class NotationsService {
  constructor(
    @InjectModel(Notation.name) private notationModel: Model<NotationDocument>,
  ) {}

  getAll(offset: number, limit: number, search: string): Promise<Notation[]> {
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

  async replace(id: string, dto: NotationReplaceDto): Promise<Notation> {
    // TODO: CHECK REPLACE
    // TODO: FIX RETURN RESULT TYPE (CREATE/UPDATE)
    return this.notationModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async update(id: string, dto: NotationUpdateDto): Promise<Notation> {
    // TODO: CHECK UPDATE
    return this.notationModel.findByIdAndUpdate(id, dto, { new: true });
  }
}