import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [RealtimeGateway],
})
export class RealtimeModule {}
