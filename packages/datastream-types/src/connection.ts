import { Request$Valid } from './request';

export interface Connection$Configuration {
  log: boolean;
  readonly url: string;
}

export type Connection$SocketEvents =
  | 'message'
  | 'error'
  | 'open'
  | 'close'
  | 'pong';

export type Connection$Events =
  | Exclude<Connection$SocketEvents, 'open' | 'pong'>
  | 'event'
  | 'will-reconnect'
  | 'reconnect'
  | 'handshake';

export type Connection$States =
  | 'DISCONNECTED'
  | 'IDLE'
  | 'CONNECTING'
  | 'RECONNECTING'
  | 'CONNECTED'
  | 'HANDSHAKED';

export enum Connection$State {
  FATAL = -1,
  DISCONNECTED = 0,
  IDLE = 1,
  CONNECTING = 2,
  RECONNECTING = 3,
  CONNECTED = 4,
  HANDSHAKED = 5,
}

export interface Connection$Controller {
  readonly sid: string;
  readonly connected: boolean;
  readonly state: Connection$State;
  reconnect(): void;
  connect(clearBufferIfNeeded?: boolean | undefined): boolean | void;
  disconnect(fatal?: boolean | undefined): void;
  send<RID extends string, REQ extends string>(
    message: Request$Valid<RID, REQ>,
    shouldBufferRequest: boolean,
  ): boolean;
  removeFromBuffer(message: Request$Valid<string, string>): boolean;
  reset(): void;
}

export interface Connection$Socket {
  readonly OPEN: number;
  readonly CONNECTING: number;
  readonly CLOSING: number;
  readonly CLOSED: number;

  readonly readyState: number;

  send(
    data: string | ArrayBuffer | Blob | ArrayBufferView,
    cb: (err?: Error) => void,
  ): void;
  close(code?: number, reason?: string): void;
  ping(sid: string): void;
  terminate(): void;
}

export interface Connection$Callback {
  (event: 'open', socket: Connection$Socket): void;
  (
    event: 'close',
    socket: Connection$Socket,
    code: number,
    reason: string,
    clean: boolean,
  ): void;
  (event: 'error', socket: Connection$Socket, error: Error): void;
  (event: 'pong', socket: Connection$Socket, data: string): void;
  (
    event: 'message',
    socket: Connection$Socket,
    data: string | ArrayBuffer | Blob | ArrayBufferView,
  ): void;
}

export type Connection$Connector = (
  config: Connection$Configuration,
  callback: Connection$Callback,
) => Connection$Socket;
