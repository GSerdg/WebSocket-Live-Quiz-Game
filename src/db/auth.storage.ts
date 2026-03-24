import { randomUUID } from 'node:crypto';
import { RegDataType, User } from '../types/dataStructureType';

export const authStorage = {
  _users: new Map<string, User>(),

  haveUser(name: string) {
    return this._users.has(name);
  },
  getUser(name: string) {
    return this._users.get(name);
  },
  setUser(userData: RegDataType) {
    const index = randomUUID();
    this._users.set(userData.name, { ...userData, index });

    return this.getUser(userData.name);
  },
};
