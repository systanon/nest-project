import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { Todo, TodoSchema } from './schemas/todo.schema';

@Module({
  providers: [TodosService],
  controllers: [TodosController],
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
})
export class TodosModule {}
