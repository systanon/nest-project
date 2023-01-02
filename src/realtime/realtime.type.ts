export enum WSChannel {
  Todo = 'todo',
  Note = 'note',
}
export const WS_CHANNELS = Object.values(WSChannel);

// WebSocketOutgoing client => server
export interface WSRequest<T = any> {
  event: WSChannel;
  data: T;
}

// WebSocketOutgoingCommandType => WSOCT
export enum WSOCT {
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe',
  Message = 'message',
}

// WebSocketOutgoingCommand => WSOC
export type WSOC<T = any> = {
  type: WSOCT;
  topic: string;
  payload: T;
};

// WebSocketIncoming server => client
export interface WSResponse<T = any> {
  event: WSChannel | 'error';
  data: T;
}

// WebSocketIncomingCommandType => WSICT
export enum WSICT {
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe',
  Send = 'send',
}

// WebSocketIncomingCommand => WSIC
export type WSIC<T = any> = {
  type: WSICT;
  topic: string;
  authorization?: string;
  payload: T;
};

export type WSCallback<T = any> = (payload: T) => unknown;
