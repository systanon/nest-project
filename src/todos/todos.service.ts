import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoCreateDto, TodoUpdateDto, TodoReplaceDto } from './dto/todo.dto';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { Pagination } from '../types/pagination';
import { Filters } from '../types/filters';

const howManyPages = (total: number, limit: number) => Math.ceil(total / limit);

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async getAll(
    { offset, limit }: Pagination,
    { search }: Filters,
  ): Promise<{
    data: Array<TodoDocument>;
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
      this.todoModel
        .find(filter, {
          _id: 1,
        })
        .countDocuments()
        .lean<number>(),
      this.todoModel
        .find<TodoDocument>(filter, projection, options)
        .sort({ createdAt: 1 }),
    ];
    const [total, data] = await Promise.all(promises);

    return {
      data: data as Array<TodoDocument>,
      total: total as number,
      pages: howManyPages(total as number, limit),
    };
  }

  getById(id: string): Promise<TodoDocument> {
    return this.todoModel.findById(id).exec();
  }

  create(dto: TodoCreateDto): Promise<TodoDocument> {
    const newTodo = new this.todoModel(dto);
    return newTodo.save();
  }

  remove(id: string) {
    return this.todoModel.findByIdAndRemove(id);
  }

  async replace(_id: string, dto: TodoReplaceDto): Promise<TodoDocument> {
    const filter = { _id };
    return this.todoModel.findOneAndReplace(filter, dto, { upsert: true });
  }

  async update(id: string, dto: TodoUpdateDto): Promise<TodoDocument> {
    return this.todoModel.findByIdAndUpdate(id, dto, { new: true });
  }
}
