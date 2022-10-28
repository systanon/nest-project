import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  Put,
  HttpCode,
  HttpStatus,
  Header,
  Query,
} from '@nestjs/common';
import {
  NotationCreateDto,
  NotationUpdateDto,
  NotationReplaceDto,
} from './dto/notation.dto';
import { NotationsService } from './notations.service';
import { Notation } from './schemas/notation.schema';
import { Pagination } from '../types/pagination';
import { GetPagination } from '../decorators/pagination.decorator';
import { Filters } from '../types/filters';
import { GetFilters } from '../decorators/filters.decorator';
@Controller('notations')
export class NotationsController {
  constructor(private readonly notationsService: NotationsService) {}

  @Get()
  getAll(
    @GetPagination() pagination: Pagination,
    @GetFilters() filters: Filters,
  ): Promise<Notation[]> {
    return this.notationsService.getAll(pagination, filters);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Notation> {
    return this.notationsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-control', 'none')
  create(@Body() dto: NotationCreateDto) {
    return this.notationsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notationsService.remove(id);
  }

  @Put(':id')
  replace(@Body() dto: NotationReplaceDto, @Param('id') id): Promise<Notation> {
    return this.notationsService.update(id, dto);
  }

  @Patch(':id')
  update(@Body() dto: NotationUpdateDto, @Param('id') id): Promise<Notation> {
    return this.notationsService.update(id, dto);
  }
}
