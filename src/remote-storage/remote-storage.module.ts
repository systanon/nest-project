import {
  RemoteStorage,
  RemoteStorageSchema,
} from './schemas/remote-storage.schema';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RemoteStorageService } from './remote-storage.service';
import { RemoteStoragesController } from './remote-storage.controller';

@Module({
  providers: [RemoteStorageService],
  controllers: [RemoteStoragesController],
  imports: [
    MongooseModule.forFeature([
      { name: RemoteStorage.name, schema: RemoteStorageSchema },
    ]),
  ],
})
export class RemoteStorageModule {}
