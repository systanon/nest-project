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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getAll(
    @Query('search') search: string,
    @GetPagination() pagination: Pagination,
  ): Promise<User[]> {
    return this.usersService.getAll(pagination, search);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-control', 'none')
  create(@Body() dto: UserCreateDto) {
    return this.usersService.create(dto);
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
