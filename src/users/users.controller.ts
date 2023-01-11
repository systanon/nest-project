import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
  Header,
  Query,
} from '@nestjs/common';
import { UserCreateDto, UserUpdateDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { Pagination } from '../types/pagination';
import { GetPagination } from '../decorators/pagination.decorator';
import { Filters } from '../types/filters';
import { GetFilters } from '../decorators/filters.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getAll(
    @GetPagination() pagination: Pagination,
    @GetFilters() filters: Filters,
  ): Promise<User[]> {
    return this.usersService.getAll(pagination, filters);
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
