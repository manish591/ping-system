import dotenv from "dotenv";
dotenv.config();

import http from "http";
import url from "url";
import { WebSocket } from "ws";
import { JwtPayload } from "jsonwebtoken";
import { createId } from '@paralleldrive/cuid2';

import { PORT } from "./constant";
import { verifyJWT } from "./utils/jwt";
import { RoomManager } from "./RoomManager";
import { 
  IncommingMessages,
  OutgoingMessages,
  SupportedIncommingMessages,
  SupportedOutgoingMessages,
} from "./messages";

const server = http.createServer();
const ws = new WebSocket.Server({ server });

const roomManager = new RoomManager();

ws.on("connection", function(connection, request) {
  const requestURL = request.url ?? "";
  const token = url.parse(requestURL, true).query.token as string;

  if(!token) {
    return connection.close();
  }

  const data = verifyJWT(token) as JwtPayload;

  if(!data) {
    return connection.close();
  }

  roomManager.createUser(data.id, data.user.name, connection);

  console.log("connection established");

  connection.on("message", function(message) {
    try {
      const decodedMessage = JSON.parse(message.toString());
      connection.send(JSON.stringify({ test: "now reading" }));
      messageHandler(decodedMessage);
    } catch(err) {
      console.log("Internal server error occured");
    }
  });

  connection.on("error", function() {
    console.log("Connection error");
  });
});

export function messageHandler(incomingMessage: IncommingMessages) {
  const messageType = incomingMessage.type;

  if(messageType === SupportedIncommingMessages.JOIN_ROOM) {
    const { userId, name, roomId } = incomingMessage.payload;

    roomManager.addUserToRoom(roomId, userId);
    const roomData = roomManager.getRooms(roomId);

    if(!roomData) {
      console.log("No details found in join room incomming")
      return;
    }

    const outgoingPayload: OutgoingMessages = {
      type: SupportedOutgoingMessages.ROOM_DETAILS,
      payload: {
        roomId: roomData.id,
        numUsers: roomData.users.length,
        users: roomData.users
      }
    }

    roomManager.broadcast(roomId, userId, outgoingPayload);
  } else if(messageType === SupportedIncommingMessages.PING_SINGLE) {
    const { message, roomId, senderId, receiverId } = incomingMessage.payload;

    const outgoingPayload: OutgoingMessages = {
      type: SupportedOutgoingMessages.PING_RESPONSE,
      payload: {
        message,
        roomId,
        senderId,
        receiverId
      }
    }

    roomManager.broadcast(roomId, senderId, outgoingPayload);
  } else if(messageType === SupportedIncommingMessages.PING_ALL) {
    const { message, roomId, senderId } = incomingMessage.payload;

    const outgoingPayload: OutgoingMessages = {
      type: SupportedOutgoingMessages.PING_ALL_RESPONSE,
      payload: {
        message,
        roomId,
        senderId,
      }
    }

    roomManager.broadcast(roomId, senderId, outgoingPayload);
  } else {
    console.log("Unhandled message");
  }
}

function INIT() {
  const roomId = createId();
  roomManager.createRoom(roomId);
}

server.listen(PORT, function() {
  INIT();
  console.log("Server is listening on PORT: ", PORT);
});