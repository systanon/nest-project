import {
  Controller,
  Get,
  Post,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UploadedFiles,
  BadRequestException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileDocument } from './schemas/file.schema';
import { Pagination } from '../types/pagination';
import { GetPagination } from '../decorators/pagination.decorator';
import { Filters } from '../types/filters';
import { GetFilters } from '../decorators/filters.decorator';
import { Response, Express } from 'express';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { SIZE } from 'src/utils/file';
import { User } from 'src/decorators/user.decorator';

const _MAX_FILE_SIZE = 5;
const MAX_FILE_SIZE = _MAX_FILE_SIZE * SIZE.MiB;

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-one')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOneFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: MAX_FILE_SIZE,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @User() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is missing in the file field');
    }
    const link = await this.filesService.save(user, file);
    return { link };
  }

  @Post('upload-many')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadManyFiles(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @User() user: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('File is missing');
    }
    // TODO: check file count
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      throw new PayloadTooLargeException(
        `File size is more than ${_MAX_FILE_SIZE} MiB`,
      );
    }

    const promises = files.map((file) => this.filesService.save(user, file));
    const links = await Promise.all(promises);
    return { links };
  }

  @Get()
  async getAll(
    @GetPagination() pagination: Pagination,
    @GetFilters() filters: Filters,
    @Res({ passthrough: true }) res: Response,
    @User() user: any,
  ): Promise<FileDocument[]> {
    const { data, total, pages } = await this.filesService.getAll(
      user,
      pagination,
      filters,
    );

    res.setHeader('X-Total-Count', total);
    res.setHeader('X-Total-Pages', pages);

    return data;
  }
}
