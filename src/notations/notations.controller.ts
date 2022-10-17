import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Put,
  HttpCode,
  HttpStatus,
  Header,
  Query,
} from '@nestjs/common';
import { CreateNotationDto } from './dto/create-notation.dto';
import { UpdateNotationDto } from './dto/update-notation.dto';
import { NotationsService } from './notations.service';
import { Notation } from './schemas/notation.schema';

@Controller('notations')
export class NotationsController {
  constructor(private readonly notationsService: NotationsService) {}

  @Get()
  getAll(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ): Promise<Notation[]> {
    const _offset = +offset || 0;
    const _limit = +limit || 4;
    return this.notationsService.getAll(_offset, _limit, search);
  }

  @Get(':id')
  getOne(@Param(':id') id: string): Promise<Notation> {
    return this.notationsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-control', 'none')
  create(@Body() CreateNotation: CreateNotationDto) {
    return this.notationsService.create(CreateNotation);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notationsService.remove(id);
  }
  @Put(':id')
  update(
    @Body() updateNotation: UpdateNotationDto,
    @Param('id') id,
  ): Promise<Notation> {
    return this.notationsService.update(id, updateNotation);
  }
}
