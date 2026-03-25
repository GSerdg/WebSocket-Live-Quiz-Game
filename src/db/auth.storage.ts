import { randomUUID } from 'node:crypto';
import { WebSocket } from 'ws';
import { RegDataReqType, User, ClientStorageType } from '../types/dataStructureType';

export const authStorage = {
  _users: new Map<string, User>(),

  haveUser(name: string) {
    return this._users.has(name);
  },
  getUser(name: string) {
    return this._users.get(name);
  },
  setUser(userData: RegDataReqType) {
    const index = randomUUID();
    this._users.set(userData.name, { ...userData, index });

    return this.getUser(userData.name);
  },
};

export const clientsStorage = {
  _clients: new Map<WebSocket, ClientStorageType>(),

  getClient(ws: WebSocket) {
    return this._clients.get(ws);
  },
  setClient(ws: WebSocket, data: ClientStorageType) {
    this._clients.set(ws, data);
  },
  getSocketByUserId(userId: string): WebSocket | undefined {
    for (const [ws, data] of this._clients.entries()) {
      if (data.userId === userId) return ws;
    }
  },
};
