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
  create(@Body() dto: NotationCreateDto) {
    return this.notationsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notationsService.remove(id);
  }

  @Put(':id')
  replace(@Body() dto: NotationReplaceDto, @Param('id') id): Promise<Notation> {
    // TODO: CHECK RETURN RESULT TYPE (CREATE/UPDATE)
    // TODO: SET HTTP STATUS CODE (201/200)
    return this.notationsService.update(id, dto);
  }

  @Patch(':id')
  update(@Body() dto: NotationUpdateDto, @Param('id') id): Promise<Notation> {
    return this.notationsService.update(id, dto);
  }
}
