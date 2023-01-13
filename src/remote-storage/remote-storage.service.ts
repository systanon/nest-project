import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RemoteStorageRecord } from './remote-storage.type';
import {
  RemoteStorage,
  RemoteStorageDocument,
} from './schemas/remote-storage.schema';

@Injectable()
export class RemoteStorageService {
  constructor(
    @InjectModel(RemoteStorage.name)
    private remoteStorageModel: Model<RemoteStorageDocument>,
  ) {}

  async get(userId: string): Promise<RemoteStorageRecord> {
    const projection = {
      __v: false,
      _id: false,
      createdAt: false,
      updatedAt: false,
      userId: false,
    };
    const record = await this.remoteStorageModel
      .findOne({ userId }, projection)
      .exec();
    return record || ({} as RemoteStorageRecord);
  }

  async update(
    userId: string,
    dto: RemoteStorageRecord,
  ): Promise<RemoteStorageRecord> {
    return this.remoteStorageModel.findOneAndUpdate(
      { userId },
      { ...dto, userId },
      { upsert: true },
    );
  }

  async replace(
    userId: string,
    dto: RemoteStorageRecord,
  ): Promise<RemoteStorageRecord> {
    return this.remoteStorageModel.findOneAndReplace(
      { userId },
      { ...dto, userId },
      { upsert: true },
    );
  }
}
