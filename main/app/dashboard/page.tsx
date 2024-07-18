"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSocket } from "../hooks/useSocket";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";

export enum SupportedIncomingMessages {
  AVAILABLE_ROOMS = "AVAILABLE_ROOMS",
  ROOM_DETAILS = "ROOM_DETAILS",
  PING_RESPONSE = "PING_RESPONSE",
  PING_ALL_RESPONSE = "PING_ALL_RESPONSE",
}

export enum SupportedOutgoingMessages {
  JOIN_ROOM = "JOIN_ROOM",
  PING_ALL = "PING_ALL",
  PING_SINGLE = "PING_SINGLE"
}

export interface Users {
  id: string,
  name: string,
  conn: WebSocket
}

type PingPayload = {
  message: string,
  roomId: string,
  senderId: string,
  receiverId?: string
}

type RoomDetailsPayload = {
  roomId: string,
  numUsers: number,
  users: Users[]
}

export type IncomingMessages = {
  type: SupportedIncomingMessages.ROOM_DETAILS,
  payload: RoomDetailsPayload
} | {
  type: SupportedIncomingMessages.PING_RESPONSE,
  payload: PingPayload
} | {
  type: SupportedIncomingMessages.PING_ALL_RESPONSE,
  payload: PingPayload
} | {
  type: SupportedIncomingMessages.AVAILABLE_ROOMS,
  payload: {
    roomId: string
  }
}

export default function Dashboard() {
  const { socket, isSocketConnected } = useSocket();
  const [roomId, setRoomId] = useState("");
  const [numUsers, setNumUsers] = useState(0);
  const [users, setUsers] = useState<Users[] | null>(null);

  useEffect(() => {
    if(!socket || !isSocketConnected) {
      return;
    }

    socket.onmessage = function(message) {
      const data = JSON.parse(message.data) as IncomingMessages;
      const messageType = data.type;

      console.log("reciever", data);

      if(messageType === SupportedIncomingMessages.AVAILABLE_ROOMS) {
        const { roomId } = data.payload;
        setRoomId(roomId);
      } else if(messageType === SupportedIncomingMessages.ROOM_DETAILS) {
        const { numUsers, users } = data.payload;
        setNumUsers(numUsers);
        setUsers(users);
      } else if(messageType === SupportedIncomingMessages.PING_RESPONSE) {
        const { message } = data.payload;
        toast({
          title: message,
          description: "Pinged privately"
        });
      } else if(messageType === SupportedIncomingMessages.PING_ALL_RESPONSE) {
        const { message } = data.payload;
        toast({
          title: message,
          description: "Pinged publically"
        });
      }
    }

    socket.onerror = function() {
      console.log("ERROR: websocket error")
    }

  }, [isSocketConnected, socket]);

  return (
    <div>
      {numUsers > 0 ? (
        <Room 
          socket={socket} 
          roomId={roomId} 
          numUsers={numUsers} 
          users={users}
        /> ):(
        <JoinRoom 
          socket={socket} 
          roomId={roomId}
        />
      )}
    </div>
  )
}

interface JoinRoomType {
  socket: WebSocket | null,
  roomId: string
}

function JoinRoom({ 
  socket,
  roomId
}: Readonly<JoinRoomType>) {
  const { data } = useSession();
  const [name, setName] = useState("");

  function handleJoinRoom() {
    if(socket) {
      socket.send(JSON.stringify({
        type: SupportedOutgoingMessages.JOIN_ROOM,
        payload: {
          roomId,
          userId: data?.userId,
          name
        }
      }));
    }
  }

  return (
    <div className="flex justify-center py-28">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Join Room</CardTitle>
          <CardDescription>Enter your name to start joining the room</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleJoinRoom}>Join</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

interface RoomTypes {
  numUsers: number,
  users: Users[] | null,
  roomId: string,
  socket: WebSocket | null,
}

function Room({ roomId, numUsers, users, socket }: Readonly<RoomTypes>) {
  const { data } = useSession();

  return (
    <div className="py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xl">
          <span className="text-gray-500">Total Users:</span>
          <span>{numUsers}</span>
        </div>
        <div>
          <Button onClick={() => {
            if(socket) {
              const message = `${data?.user?.name} has pinged you`;
              const senderId = data?.userId;

              socket.send(JSON.stringify({
                type: SupportedOutgoingMessages.PING_ALL,
                payload: {
                  roomId,
                  senderId,
                  message
                }
              }));
            }
          }}>Ping Everyone</Button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        {
          users && users.map(user => {
            return (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.id}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => {
                      const receiverId = user.id;
                      const senderId = data?.userId;
                      const message = `${data?.user?.name} has pinged you!`;

                      if(socket) {
                        socket.send(JSON.stringify({
                          type: SupportedOutgoingMessages.PING_SINGLE,
                          payload: {
                            roomId,
                            receiverId,
                            senderId,
                            message
                          }
                        }));
                      }
                    }}
                  >
                    Ping
                  </Button>
                </CardFooter>
              </Card>
            )
          })
        }
      </div>
    </div>
  )
}