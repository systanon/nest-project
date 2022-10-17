import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotationsController } from './notations.controller';
import { NotationsService } from './notations.service';
import { Notation, NotationSchema } from './schemas/notation.schema';

@Module({
  providers: [NotationsService],
  controllers: [NotationsController],
  imports: [
    MongooseModule.forFeature([
      { name: Notation.name, schema: NotationSchema },
    ]),
  ],
})
export class NotationsModule {}
