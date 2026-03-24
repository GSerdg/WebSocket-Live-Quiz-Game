import { authService } from '../services/authService';
import { CommandsStructureType, CommandType, RegDataType } from '../types/dataStructureType';

export const handleMessage = (message: CommandsStructureType) => {
  switch (message.type) {
    case CommandType.REG:
      return authService.handleReg(message as CommandsStructureType<RegDataType>);

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
