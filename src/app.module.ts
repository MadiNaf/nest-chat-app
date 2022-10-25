import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy.ts';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';

@Module({
  imports: [UserModule, ChatModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtStrategy, UserService, JwtService, AppGateway],
})
export class AppModule {}
