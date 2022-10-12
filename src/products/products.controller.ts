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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAll(): Promise<Product[]> {
    return this.productsService.getAll();
  }

  @Get(':id')
  getOne(@Param(':id') id: string): Promise<Product> {
    return this.productsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-control', 'none')
  create(@Body() CreateProduct: CreateProductDto) {
    return this.productsService.create(CreateProduct);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
  @Put(':id')
  update(
    @Body() updateProduct: UpdateProductDto,
    @Param('id') id,
  ): Promise<Product> {
    return this.productsService.update(id, updateProduct);
  }
}
