import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotationsModule } from './notations/notations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
    }),
    NotationsModule,
    MongooseModule.forRoot(process.env.DATA_BASE_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
