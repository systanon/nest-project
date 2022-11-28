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
import { Response } from 'express';
import { User } from 'src/decorators/user.decorator';

@Controller('notations')
export class NotationsController {
  constructor(private readonly notationsService: NotationsService) {}

  @Get()
  async getAll(
    @GetPagination() pagination: Pagination,
    @GetFilters() filters: Filters,
    @Res({ passthrough: true }) res: Response,
    @User() user: any,
  ): Promise<Notation[]> {
    const { data, total, pages } = await this.notationsService.getAll(
      user.userId,
      pagination,
      filters,
    );

    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Total-Pages', pages);

    return data;
  }

  @Get(':id')
  getOne(@Param('id') id: string, @User() user: any): Promise<Notation> {
    return this.notationsService.getById(user.userId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-control', 'none')
  create(@Body() dto: NotationCreateDto, @User() user: any) {
    return this.notationsService.create(user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.notationsService.remove(user.userId, id);
  }

  @Put(':id')
  replace(
    @Body() dto: NotationReplaceDto,
    @Param('id') id,
    @User() user: any,
  ): Promise<Notation> {
    return this.notationsService.update(user.userId, id, dto);
  }

  @Patch(':id')
  update(
    @Body() dto: NotationUpdateDto,
    @Param('id') id,
    @User() user: any,
  ): Promise<Notation> {
    return this.notationsService.update(user.userId, id, dto);
  }
}
