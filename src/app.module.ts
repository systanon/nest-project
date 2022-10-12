import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/poducts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
    }),
    ProductsModule,
    MongooseModule.forRoot(process.env.DATA_BASE_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
