import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  GatewayMetadata,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import * as WS from 'ws';
import { realtimeBus } from './realtime.bus';
import {
  WSChannel,
  WSIC,
  WSICT,
  WSOC,
  WSOCT,
  WSResponse,
} from './realtime.type';

const createTodoWSOC = <T = any>(wsic: WSIC<T>): WSOC<T> => {
  const { type, topic, payload } = wsic;
  return {
    type: type === WSICT.Send ? WSOCT.Message : (type as any as WSOCT),
    topic,
    payload,
  };
};

const getKey = (channel: WSChannel, topic: string) => `${channel}:${topic}`;

const options: GatewayMetadata = {
  path: '/realtime',
  transports: ['websocket'],
  cors: { origin: '*' },
};

@WebSocketGateway(options)
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly conections = new Set<WS>();
  private readonly subscribers = new Map<string, Array<WS>>();

  constructor() {
    realtimeBus.addListener('todo:insert', this.todoCRUD('insert'));
    realtimeBus.addListener('todo:update', this.todoCRUD('update'));
    realtimeBus.addListener('todo:replace', this.todoCRUD('replace'));
    realtimeBus.addListener('todo:remove', this.todoCRUD('remove'));
  }

  afterInit(server: WS.Server) {
    // TODO: require implement
  }
  handleConnection(client: WS, ...args: any[]) {
    this.conections.add(client);
  }
  handleDisconnect(client: WS) {
    this.conections.delete(client);
  }

  @SubscribeMessage(WSChannel.Todo)
  handleTodo(
    @ConnectedSocket() client: WS,
    @MessageBody() wsic: WSIC,
  ): WSResponse<WSOC> {
    console.log('🚀 ~ Todo ~ ', wsic);
    const event = WSChannel.Todo;
    const data = createTodoWSOC(wsic);
    switch (wsic.type) {
      case WSICT.Send:
        this.sendToSubscribers(event, wsic.topic, data);
        return;
      case WSICT.Subscribe:
        this.subscribe(event, wsic.topic, client);
        return { event, data };
      case WSICT.Unsubscribe:
        this.unsubscribe(event, wsic.topic, client);
        return { event, data };
      default:
        throw new InternalServerErrorException(
          'Unknown websocket outgoing command type.',
        );
    }
  }

  @SubscribeMessage(WSChannel.Note)
  handleNote(
    @ConnectedSocket() client: WS,
    @MessageBody() wsic: WSIC,
  ): Observable<WSResponse<WSOC>> {
    console.log('🚀 ~ Note ~ ', wsic);
    const { topic, payload } = wsic;

    const event = WSChannel.Note;
    const type = WSOCT.Message;
    const response = [1, 2, 3];

    return from(response).pipe(
      map((num) => ({
        event,
        data: { type, topic, payload: { ...payload, num } },
      })),
    );
  }

  private todoCRUD(action: 'insert' | 'update' | 'replace' | 'remove') {
    return (particleUserFromDB) => {
      const topic = 'CRUD';
      const data: WSOC = {
        type: WSOCT.Message,
        topic,
        payload: {
          action,
          data: particleUserFromDB,
        },
      };
      this.sendToSubscribers(WSChannel.Todo, topic, data);
    };
  }

  private sendToEveryone<T = any>(response: WSResponse<WSOC<T>>) {
    const message = JSON.stringify(response);
    this.conections.forEach((conection) => conection.send(message));
  }
  private subscribe(channel: WSChannel, topic: string, client: WS): boolean {
    const key = getKey(channel, topic);
    const conections = this.subscribers.get(key) ?? <Array<WS>>[];
    if (conections.includes(client)) return false;
    conections.push(client);
    this.subscribers.set(key, conections);
    return true;
  }
  private unsubscribe(channel: WSChannel, topic: string, client: WS): void {
    const key = getKey(channel, topic);
    let conections = this.subscribers.get(key) ?? <Array<WS>>[];
    conections = conections.filter((conection) => conection !== client);
    this.subscribers.set(key, conections);
  }
  private sendToSubscribers<T = any>(
    channel: WSChannel,
    topic: string,
    data: WSOC<T>,
  ) {
    const response: WSResponse<WSOC> = { event: channel, data };
    const key = getKey(channel, topic);
    const message = JSON.stringify(response);
    const conections = this.subscribers.get(key) ?? <Array<WS>>[];
    conections.forEach((conection) => conection.send(message));
  }
}
