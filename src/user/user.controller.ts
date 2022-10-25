import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConnectedUser, Credentials, User } from 'src/model/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllUsers(): Promise<User []> {
    try {
      return await this.userService.getUsers();
    } catch (error) {
     return [error]; 
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile/:id')
  async getOneUser(@Param('id') id: number): Promise<User> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
     return error; 
    }
  }

  @Get('/session')
  async getSession(): Promise<ConnectedUser []> {
    try {
      return await this.userService.getConnectedUsers();
    } catch (error) {
     return [error]; 
    }
  }
}
