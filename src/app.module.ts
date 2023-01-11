import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthMiddleware } from './middlewares/auth.middlewares';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotationsModule } from './notations/notations.module';
import { RealtimeModule } from './realtime/realtime.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';
import { resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
    }),
    NotationsModule,
    TodosModule,
    UsersModule,
    MongooseModule.forRoot(process.env.DATA_BASE_URL),
    AuthModule,
    RealtimeModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: resolve('upload-files'),
      exclude: ['/api*'],
      serveRoot: '/files',
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthMiddleware,
  ],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  public configure(consumer: MiddlewareConsumer) {
    const path = '/';
    consumer.apply(AuthMiddleware).forRoutes(path);
  }
}
