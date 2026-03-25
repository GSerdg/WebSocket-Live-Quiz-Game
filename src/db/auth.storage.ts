import { randomUUID } from 'node:crypto';
import { WebSocket } from 'ws';
import { RegDataReqType, Player, clientStorageType } from '../types/dataStructureType';

export const authStorage = {
  _users: new Map<string, Player>(),

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
  _clients: new Map<WebSocket, clientStorageType>(),

  getClient(ws: WebSocket) {
    return this._clients.get(ws);
  },
  setClient(ws: WebSocket, data: clientStorageType) {
    this._clients.set(ws, data);
  },
};
