import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotationDocument = Notation & Document;

@Schema({ timestamps: true })
export class Notation {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    default: false,
    required: false,
  })
  complete: boolean;
}

export const NotationSchema = SchemaFactory.createForClass(Notation);
