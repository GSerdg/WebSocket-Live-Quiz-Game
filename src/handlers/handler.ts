import { WebSocket } from 'ws';
import { authService } from '../services/authService';
import { gameService } from '../services/gameService';
import {
  AnswerType,
  CommandsStructureType,
  CommandType,
  Question,
  RegDataReqType,
} from '../types/dataStructureType';

export const handleMessage = (
  message: CommandsStructureType,
  ws: WebSocket
): CommandsStructureType | undefined => {
  switch (message.type) {
    case CommandType.REG:
      return authService.handleReg(message as CommandsStructureType<RegDataReqType>);
    case CommandType.CREATE_GAME:
      return gameService.handleCreateGame(
        message as CommandsStructureType<{ questions: Question[] }>,
        ws
      );
    case CommandType.JOIN_GAME:
      return gameService.handleJoinGame(message as CommandsStructureType<{ code: string }>, ws);
    case CommandType.START_GAME:
      gameService.handleStartGame(message as CommandsStructureType<{ gameId: string }>, ws);
      break;
    case CommandType.ANSWER:
      return gameService.handleAnswer(message as CommandsStructureType<AnswerType>, ws);

    default:
      return {
        type: message.type,
        data: {
          error: true,
          errorText: 'Unknown command',
        },
        id: message.id,
      };
  }
};
