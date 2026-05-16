import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';

function getSocketURL(): string {
  const hostUri =
    Constants?.expoConfig?.hostUri ??
    (Constants as any)?.manifest?.debuggerHost ??
    (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:4000`;
  }

  const { Platform } = require('react-native');
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : 'http://localhost:4000';
}

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(getSocketURL(), {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.log('[Socket] Error:', err.message);
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  emit(event: string, data?: unknown) {
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: unknown[]) => void) {
    this.socket?.off(event, callback);
  }

  get instance() {
    return this.socket;
  }
}

export const socketService = new SocketService();
