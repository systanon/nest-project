import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { Pagination } from '../types/pagination';
import { Filters } from '../types/filters';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { UPLOAD_DIRNAME, UPLOAD_URL } from 'src/constants';
import { howManyPages } from 'src/utils/pagination';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async save(user: any, file: Express.Multer.File): Promise<string> {
    const { originalname, mimetype, buffer, size } = file;
    const date = new Date().toISOString().split('T')[0];
    const id = uuidv4();
    const extension = extname(originalname);
    const filename = `${date}_${id}${extension}`;
    const path = resolve(UPLOAD_DIRNAME, filename);
    const link = `${UPLOAD_URL}/${filename}`;
    const dto = {
      originalname,
      filename,
      size,
      mimetype,
      userId: user.userId,
      link,
    };

    await writeFile(path, buffer);

    const newFile = new this.fileModel(dto);
    const fileDocument = await newFile.save();
    return link;
  }

  async getAll(
    user: any,
    { offset, limit }: Pagination,
    { search }: Filters,
  ): Promise<{
    data: Array<FileDocument>;
    total: number;
    pages: number;
  }> {
    const filter: Record<string, any> = { userId: user.userId };
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
      this.fileModel
        .find(filter, {
          _id: 1,
        })
        .countDocuments()
        .lean<number>(),
      this.fileModel
        .find<FileDocument>(filter, projection, options)
        .sort({ createdAt: 1 }),
    ];
    const [total, data] = await Promise.all(promises);

    return {
      data: data as Array<FileDocument>,
      total: total as number,
      pages: howManyPages(total as number, limit),
    };
  }
}
