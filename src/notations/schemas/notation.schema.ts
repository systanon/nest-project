import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotationDocument = Notation & Document;

@Schema()
export class Notation {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const NotationSchema = SchemaFactory.createForClass(Notation);
