"use client";

import { useEffect, useRef, useState } from 'react';
import { generateWebsocketAuthToken } from '@/app/actions';

export function useSocket() {
  const socket = useRef<null | WebSocket>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(function() {
    (async function() {
      try {
        const { status, data } = await generateWebsocketAuthToken();

        if(status === "success" && data) {
          const ws = new WebSocket(`ws://localhost:8000?token=${data.token}`);

          ws.onopen = function() {
            if(!socket.current) {
              socket.current = ws;
            }
            console.log("Connection Established");
            setIsSocketConnected(true);
          }

          ws.onclose = function() {
            socket.current = null;
            console.log("Connection closed");
            setIsSocketConnected(false);
          }
        }
      } catch(err) {
        console.log("Unable to make a websocket conection");
      }
    })();

    return () => {
      console.log("unmouny");
      socket.current?.close();
    }
  }, []);

  return { socket: socket.current, isSocketConnected};
}