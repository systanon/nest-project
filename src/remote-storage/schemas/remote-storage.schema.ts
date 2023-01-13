import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type RemoteStorageDocument = RemoteStorage & Document;

@Schema({ timestamps: true, strict: false })
export class RemoteStorage {
  @Prop({
    required: true,
    unique: true,
  })
  userId: string;
}

export const RemoteStorageSchema = SchemaFactory.createForClass(RemoteStorage);
