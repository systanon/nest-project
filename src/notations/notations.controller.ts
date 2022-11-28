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
  Res,
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
import { Public } from 'src/decorators/public.decorator';
import { Response } from 'express';

@Controller('notations')
export class NotationsController {
  constructor(private readonly notationsService: NotationsService) {}

  @Public()
  @Get()
  async getAll(
    @GetPagination() pagination: Pagination,
    @GetFilters() filters: Filters,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Notation[]> {
    const { data, total, pages } = await this.notationsService.getAll(
      pagination,
      filters,
    );

    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Total-Pages', pages);

    return data;
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
