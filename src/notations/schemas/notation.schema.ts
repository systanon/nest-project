import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotationDocument = Notation & Document;

@Schema({ timestamps: true })
export class Notation {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const NotationSchema = SchemaFactory.createForClass(Notation);
