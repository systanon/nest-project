import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { RemoteStorageService } from './remote-storage.service';
import { User } from 'src/decorators/user.decorator';
import { CachedUser } from 'src/types/cached-user';
import { RemoteStorageRecord } from './remote-storage.type';

@Controller('remote-storage')
export class RemoteStoragesController {
  constructor(private readonly remoteStorageService: RemoteStorageService) {}

  @Get()
  get(@User() user: CachedUser): Promise<RemoteStorageRecord> {
    return this.remoteStorageService.get(user.userId);
  }

  @Patch()
  async update(
    @Body() dto: RemoteStorageRecord,
    @User() user: CachedUser,
  ): Promise<void> {
    this.validate(dto);
    await this.remoteStorageService.update(user.userId, dto);
  }

  @Put()
  async replace(
    @Body() dto: RemoteStorageRecord,
    @User() user: CachedUser,
  ): Promise<void> {
    this.validate(dto);
    await this.remoteStorageService.replace(user.userId, dto);
  }

  private validate(dto: RemoteStorageRecord) {
    if (
      typeof dto !== 'object' ||
      Array.isArray(dto) ||
      dto === null ||
      dto.userId !== undefined
    )
      throw new BadRequestException();
  }
}
