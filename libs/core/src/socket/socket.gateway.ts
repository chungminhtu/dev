import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket as _Socket } from 'socket.io';
import { Room } from 'socket.io-adapter';
import { Server } from 'socket.io';
import { LoggingService } from '../logging';

export class Socket extends _Socket {
  _room: Room;
  _rooms: Array<Room>;
}

@WebSocketGateway()
export class SocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  readonly logger = new LoggingService().getLogger(SocketGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const address = client?.handshake?.address.split(':')?.pop();
    this.logger.info(`Client connected: ${client.id} (${address})`);
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Client disconnected: ${client.id}`);
  }

  protected getRoomsIter(client: Socket) {
    const rooms = client.rooms.values();
    rooms.next();
    return rooms;
  }

  protected getRoom(client: Socket): string {
    return client._room;
    const rooms = this.getRoomsIter(client);
    return rooms.next().value;
  }

  @SubscribeMessage('ping')
  protected pong() {
    return { event: 'ping', data: 'pong' };
  }

  @SubscribeMessage('join')
  protected async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: string) {
    await client.join(payload);
    return { event: 'join', data: { status: true } };
  }

  // @SubscribeMessage('msgToServer')
  protected onMsgToServer(client: Socket, payload: any) {
    const room = this.getRoom(client);
    return this.server.to(room).emit('msgToServer', payload);
  }

  async emitToRoom(room: string, topic: string, data) {
    this.server.to(room).emit(topic, data);
    const roomUsers = await this.server.in(room).fetchSockets();
    const roomUsers1 = await this.server.of('/').in(room).allSockets();
    this.server.emit(topic, data);
  }

  @SubscribeMessage('join-room')
  protected async onJoinRoom(@ConnectedSocket() socket: Socket, @MessageBody('room') room: string) {
    socket._room = room;
    await socket.join(room);
    socket.emit('join-room', { status: true });
  }

  @SubscribeMessage('leave-room')
  protected async onLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody('room') room: string): Promise<void> {
    await client.leave(room);
    this.server.to(room).emit('left-room', { status: true });
  }
}
