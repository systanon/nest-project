import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotationsModule } from './notations/notations.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthMiddleware } from './middlewares/auth.middlewares';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { RealtimeModule } from './realtime/realtime.module';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
    // const isDevelopment = this.configService.get<boolean>('mode.isDevelopment');
    // if (isDevelopment) {
    //   consumer.apply(LoggerMiddleware).forRoutes(path);
    // }
    consumer.apply(AuthMiddleware).forRoutes(path);
  }
}
