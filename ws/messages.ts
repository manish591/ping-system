import { Users } from "./RoomManager";

export enum SupportedOutgoingMessages {
  AVAILABLE_ROOMS = "AVAILABLE_ROOMS",
  ROOM_DETAILS = "ROOM_DETAILS",
  PING_RESPONSE = "PING_RESPONSE",
  PING_ALL_RESPONSE = "PING_ALL_RESPONSE",
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

export type OutgoingMessages = {
  type: SupportedOutgoingMessages.ROOM_DETAILS,
  payload: RoomDetailsPayload
} | {
  type: SupportedOutgoingMessages.PING_RESPONSE,
  payload: PingPayload
} | {
  type: SupportedOutgoingMessages.PING_ALL_RESPONSE,
  payload: PingPayload
} | {
  type: SupportedOutgoingMessages.AVAILABLE_ROOMS,
  payload: {
    roomId: string
  }
}

export enum SupportedIncommingMessages {
  JOIN_ROOM = "JOIN_ROOM",
  PING_ALL = "PING_ALL",
  PING_SINGLE = "PING_SINGLE"
}

type JoinRoomPayload = {
  name: string,
  userId: string,
  roomId: string
}

export type IncommingMessages = {
  type: SupportedIncommingMessages.JOIN_ROOM,
  payload: JoinRoomPayload
} | {
  type: SupportedIncommingMessages.PING_ALL,
  payload: PingPayload
} | {
  type: SupportedIncommingMessages.PING_SINGLE,
  payload: PingPayload
}