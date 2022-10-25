import { Logger } from '@nestjs/common';
import { SubscribeMessage,
         WebSocketGateway,
         OnGatewayInit,
         OnGatewayConnection,
         OnGatewayDisconnect,
         WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './model/chat.model';

@WebSocketGateway({ cors: {origin: '*' }})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private logger = new Logger('AppGateway');

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: Message): void {
    this.server.emit('messageToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('--- server init ---');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.server.emit('openSession', client.id);
    this.logger.log(` -> Client ${client.id} is connected.`);
  }

  handleDisconnect(client: Socket) {
    this.server.emit('closeSession', client.id);
    this.logger.log(` <- Client ${client.id} is disconnected.`);
  }

}
