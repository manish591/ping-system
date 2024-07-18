import { WebSocket } from "ws";
import { OutgoingMessages, SupportedOutgoingMessages } from "./messages";

export interface Users {
  id: string,
  name: string,
  conn: WebSocket
}

interface Room {
  id: string,
  limit: number
  users: Users[]
}

export class RoomManager {
  private rooms: Map<string, Room>;
  private users: Map<string, Users>

  constructor() {
    this.rooms = new Map();
    this.users = new Map();
  }

  createUser(userId: string, name: string, connection: WebSocket) {
    const user = this.users.get(userId);

    if(user) {
      return;
    }

    this.users.set(userId, {
      id: userId,
      name,
      conn: connection
    });

    const availableRoom = this.getAvailableRoom();

    if(!availableRoom) {
      console.log("No rooms available");
      return connection.close();
    }

    const outgoingPayload: OutgoingMessages = {
      type: SupportedOutgoingMessages.AVAILABLE_ROOMS,
      payload: {
        roomId: availableRoom.id,
      }
    }
  
    this.broadcast(availableRoom.id, userId, outgoingPayload);

    connection.on("close", () => {
      console.log("closing connection");
      console.log("the users:", this.rooms);
      this.deleteUser(userId);
      this.removeUserFromRoom(availableRoom.id, userId);

      console.log("the users:", this.rooms);

      const currentRoomData = this.getRooms(availableRoom.id);

      if(!currentRoomData) {
        return;
      }

      const outgoingPayload: OutgoingMessages = {
        type: SupportedOutgoingMessages.ROOM_DETAILS,
        payload: {
          roomId: currentRoomData.id,
          users: currentRoomData.users,
          numUsers: currentRoomData.users.length
        }
      }

      this.broadcast(currentRoomData.id, userId, outgoingPayload);
    });
  }

  deleteUser(userId: string) {
    this.users.delete(userId);
  }

  addUserToRoom(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    const user = this.users.get(userId);

    if(!room) {
      console.log("Room not found");
      return;
    }

    if(!user) {
      console.log("User not found");
      return;
    }

    room?.users.push(user);
  }

  removeUserFromRoom(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    
    if(!room) {
      return;
    }

    const updatedUser = room.users.filter(user => user.id !== userId);
    room.users = updatedUser;
  }

  createRoom(roomId: string) {
    this.rooms.set(roomId, {
      id: roomId,
      limit: 20,
      users: []
    });
  }

  getAvailableRoom(): Room | null {
    let roomFound: Room | null = null;

    this.rooms.forEach(room => {
      if(room.users.length < room.limit) {
        roomFound = room;
      }
    });

    return roomFound;
  }

  getRooms(roomId: string) {
    const room = this.rooms.get(roomId);

    if(!room) {
      console.log("No rooms found");
      return;
    }

    return room;
  }

  broadcast(roomId: string, userId: string, payload: OutgoingMessages) {
    const room = this.rooms.get(roomId);

    if(!room) {
      console.log("Room not found for broadcasting");
      return;
    }

    switch(payload.type) {
      case SupportedOutgoingMessages.ROOM_DETAILS:
        room.users.forEach(user => {
          user.conn.send(JSON.stringify(payload));
        });
      break;
      case SupportedOutgoingMessages.PING_RESPONSE:
        const receiverId = payload.payload.receiverId;
        room.users.forEach(user => {
          if(user.id === receiverId) {
            user.conn.send(JSON.stringify(payload));
          }
        });
      break;
      case SupportedOutgoingMessages.AVAILABLE_ROOMS:
        this.users.get(userId)?.conn.send(JSON.stringify(payload));
        break;
      case SupportedOutgoingMessages.PING_ALL_RESPONSE:
        room.users.forEach(user => {
          if(user.id !== userId) {
            user.conn.send(JSON.stringify(payload));
          }
        });
      break;
      default:
        console.log("Unsupported outgoing message");
    }
  }
}
