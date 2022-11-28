import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  Put,
  Res,
} from '@nestjs/common';
import { TodoCreateDto, TodoUpdateDto, TodoReplaceDto } from './dto/todo.dto';
import { TodosService } from './todos.service';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { Pagination } from '../types/pagination';
import { GetPagination } from '../decorators/pagination.decorator';
import { Filters } from '../types/filters';
import { GetFilters } from '../decorators/filters.decorator';
import { Public } from 'src/decorators/public.decorator';
import { Response } from 'express';

@Public()
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getAll(
    @GetPagination() pagination: Pagination,
    @GetFilters() filters: Filters,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TodoDocument[]> {
    const { data, total, pages } = await this.todosService.getAll(
      pagination,
      filters,
    );

    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Total-Pages', pages);

    return data;
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Todo> {
    return this.todosService.getById(id);
  }

  @Post()
  create(@Body() dto: TodoCreateDto) {
    return this.todosService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }

  @Put(':id')
  replace(@Body() dto: TodoReplaceDto, @Param('id') id): Promise<Todo> {
    return this.todosService.update(id, dto);
  }

  @Patch(':id')
  update(@Body() dto: TodoUpdateDto, @Param('id') id): Promise<Todo> {
    return this.todosService.update(id, dto);
  }
}
