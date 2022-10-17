import { Test, TestingModule } from '@nestjs/testing';
import { NotationsController } from './notations.controller';

describe('NotationsController', () => {
  let controller: NotationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotationsController],
    }).compile();

    controller = module.get<NotationsController>(NotationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
