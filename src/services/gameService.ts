import { clientsStorage } from '../db/auth.storage';
import { gameStorage } from '../db/game.storage';
import { CommandsStructureType, Question, CreateGameDataResType } from '../types/dataStructureType';
import { WebSocket } from 'ws';

export const gameService = {
  handleCreateGame(
    message: CommandsStructureType<{ questions: Question[] }>,
    ws: WebSocket
  ): CommandsStructureType<CreateGameDataResType> {
    const { data } = message;
    const hostId = clientsStorage.getClient(ws)?.userId;

    if (!hostId) throw new Error('User id not found');

    const responseData = gameStorage.createGame(data.questions, hostId);

    return { ...message, data: responseData };
  },
};
