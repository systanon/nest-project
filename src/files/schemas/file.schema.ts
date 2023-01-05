import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  originalname: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  mimetype: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
