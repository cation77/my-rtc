import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SignalingModule } from './signaling/signaling.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [SignalingModule]
})
export class AppModule {}
