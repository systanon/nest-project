import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { UserUpdateDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { Pagination } from '../types/pagination';
import { GetPagination } from '../decorators/pagination.decorator';
import { Filters } from '../types/filters';
import { GetFilters } from '../decorators/filters.decorator';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async getAll(
    @GetPagination() pagination: Pagination,
    @GetFilters() filters: Filters,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDocument[]> {
    const { data, total, pages } = await this.usersService.getAll(
      pagination,
      filters,
    );

    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Total-Pages', pages);

    return data;
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  update(@Body() dto: UserUpdateDto, @Param('id') id): Promise<User> {
    return this.usersService.update(id, dto);
  }
}
