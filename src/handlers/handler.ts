import { WebSocket } from 'ws';
import { authService } from '../services/authService';
import { gameService } from '../services/gameService';
import {
  CommandsStructureType,
  CommandType,
  Question,
  RegDataReqType,
} from '../types/dataStructureType';

export const handleMessage = (
  message: CommandsStructureType,
  ws: WebSocket
): CommandsStructureType => {
  switch (message.type) {
    case CommandType.REG:
      return authService.handleReg(message as CommandsStructureType<RegDataReqType>);
    case CommandType.CREATE_GAME:
      return gameService.handleCreateGame(
        message as CommandsStructureType<{ questions: Question[] }>,
        ws
      );

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
