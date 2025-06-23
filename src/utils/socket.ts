import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_API_URL!;
    console.log("🔌 Conectando ao socket:", url);

    socket = io(url, {
      transports: ['websocket'], // <- ESSENCIAL
    });
  }
  return socket;
}