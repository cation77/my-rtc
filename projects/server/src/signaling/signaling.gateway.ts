import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

interface Room {
  clients: Set<Socket>
}

@WebSocketGateway(6055) // 设置信令服务的端口为 6055
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  private rooms: Map<string, Room> = new Map()

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
    this.rooms.forEach((room, roomName) => {
      room.clients.delete(client)
      this.notifyClients(roomName)
    })
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomName: string): void {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, { clients: new Set() })
    }
    this.rooms.get(roomName)!.clients.add(client)
    client.join(roomName)
    this.notifyClients(roomName)
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomName: string): void {
    if (this.rooms.has(roomName)) {
      const room = this.rooms.get(roomName)!
      room.clients.delete(client)
      this.notifyClients(roomName)
    }
  }

  @SubscribeMessage('signal')
  handleSignal(
    @MessageBody() { roomName, signal }: { roomName: string; signal: any },
    client: Socket
  ): void {
    client.to(roomName).emit('signal', { signal, from: client.id })
  }

  private notifyClients(roomName: string) {
    const room = this.rooms.get(roomName)
    if (room) {
      const clientIds = Array.from(room.clients).map((client) => client.id)
      this.server.to(roomName).emit('roomUpdate', { clients: clientIds })
    }
  }
}
