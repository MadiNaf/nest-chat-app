import { Controller, Get, Post, Put, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Message, Topic } from 'src/model/chat.model';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/topic/all')
  async getAllTopics(): Promise<Topic []> {
    return await this.chatService.getTopics();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/topic/user/:id')
  async getTopicByUserId(@Param('id') userId: number): Promise<Topic []> {
    return await this.chatService.getTopicByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/topic/new')
  async createTopic(@Body() topic: Topic): Promise<Topic []> {
    return await this.chatService.addTopic(topic);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/topic')
  async updateTopic(@Body() topic: Topic): Promise<Topic> {
    return await this.chatService.updateTopic(topic?.id, topic);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/topic/:id/:username')
  async delteTopic(@Param('id') id: number, @Param('username') username: string): Promise<boolean> {
    return await this.chatService.delteTopic(id, username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/message/:id')
  async getMessagesByTopic(@Param('id') topicId: number): Promise<Message []> {
    return await this.chatService.getMessagesByTopic(topicId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/message/new')
  async createMessage(@Body() message: Message): Promise<Message> {
    return await this.chatService.sendMessage(message);
  }
}
