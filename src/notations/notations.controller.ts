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
} from '@nestjs/common';
import { CreateNotationDto } from './dto/create-notation.dto';
import { UpdateNotationDto } from './dto/update-notation.dto';
import { NotationsService } from './notations.service';
import { Notation } from './schemas/notation.schema';

@Controller('notations')
export class NotationsController {
  constructor(private readonly notationsService: NotationsService) {}

  @Get()
  getAll(): Promise<Notation[]> {
    return this.notationsService.getAll();
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
