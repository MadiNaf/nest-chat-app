import { Module } from '@nestjs/common';
import { AppGateway } from 'src/app.gateway';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy.ts';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, JwtStrategy, AppGateway]
})
export class ChatModule {}
