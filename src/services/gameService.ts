import { authStorage, clientsStorage } from '../db/auth.storage';
import { gameStorage } from '../db/game.storage';
import {
  CommandsStructureType,
  Question,
  CreateGameDataResType,
  CommandType,
  QuestionResType,
} from '../types/dataStructureType';
import { WebSocket } from 'ws';
import { broadcastToGame } from '../utils/broadcastToGame';

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

  handleJoinGame(
    message: CommandsStructureType<{ code: string }>,
    ws: WebSocket
  ): CommandsStructureType<{ gameId: string }> {
    const { data, id } = message;
    const client = clientsStorage.getClient(ws);
    const user = authStorage.getUser(client?.userName ?? '');

    if (!client || !user) throw new Error('User id not found');

    const { gameId, playerName, playerCount, players } = gameStorage.joinGame(data.code, user);

    const broadcastJoinedMessage = {
      type: CommandType.PLAYER_JOINED,
      data: { playerName, playerCount },
      id: 0,
    };
    const broadcastUpdatePlayersMessage = {
      type: CommandType.UPDATE_PLAYERS,
      data: players,
      id: 0,
    };

    broadcastToGame(gameId, broadcastJoinedMessage);
    broadcastToGame(gameId, broadcastUpdatePlayersMessage);

    return { type: CommandType.GAME_JOINED, data: { gameId }, id };
  },

  handleStartGame(message: CommandsStructureType<{ gameId: string }>, ws: WebSocket) {
    const { data } = message;
    const clientId = clientsStorage.getClient(ws)?.userId;

    if (!clientId) throw new Error('User id not found');

    const game = gameStorage.getGame(data.gameId);

    if (clientId !== game?.hostId) throw new Error('Only host can start game');

    game.currentQuestion += 1;
    game.status = 'in_progress';

    const { text, options, timeLimitSec } = game.questions[game.currentQuestion];

    const broadcastQuestionMessage: CommandsStructureType<QuestionResType> = {
      type: CommandType.QUESTION,
      id: 0,
      data: {
        text,
        options,
        timeLimitSec,
        questionNumber: game.currentQuestion + 1,
        totalQuestions: game.questions.length,
      },
    };

    broadcastToGame(data.gameId, broadcastQuestionMessage);
  },
};
