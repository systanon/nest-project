import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotationDto } from './dto/create-notation.dto';
import { UpdateNotationDto } from './dto/update-notation.dto';
import { Notation, NotationDocument } from './schemas/notation.schema';

@Injectable()
export class NotationsService {
  constructor(
    @InjectModel(Notation.name) private notationModel: Model<NotationDocument>,
  ) {}

  getAll(): Promise<Notation[]> {
    return this.notationModel.find().exec();
  }

  async getById(id: string): Promise<Notation> {
    return this.notationModel.findById(id);
  }

  create(notationDto: CreateNotationDto): Promise<Notation> {
    const newNotation = new this.notationModel(notationDto);
    return newNotation.save();
  }

  remove(id: string) {
    return this.notationModel.findByIdAndRemove(id);
  }

  async update(id: string, notationDto: UpdateNotationDto): Promise<Notation> {
    return this.notationModel.findByIdAndUpdate(id, notationDto, { new: true });
  }
  async updateOne(
    id: string,
    notationDto: UpdateNotationDto,
  ): Promise<Notation> {
    return this.notationModel.findByIdAndUpdate(id, notationDto, { new: true });
  }
}
