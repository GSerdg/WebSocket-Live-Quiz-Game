import { authStorage } from '../db/auth.storage';
import {
  CommandsStructureType,
  CommandType,
  RegDataResType,
  RegDataType,
} from '../types/dataStructureType';

export const authService = {
  handleReg(message: CommandsStructureType<RegDataType>): CommandsStructureType<RegDataResType> {
    const { data } = message;

    const response = {
      type: CommandType.REG,
      data: {
        name: data.name,
        index: '',
        error: false,
        errorText: '',
      },
      id: message.id,
    };

    const userData = authStorage.getUser(data.name);

    if (userData) {
      response.data =
        userData.password === data.password
          ? {
              ...response.data,
              index: userData.index,
            }
          : {
              ...response.data,
              index: userData.index,
              error: true,
              errorText: 'Wrong password',
            };
    } else {
      const newUser = authStorage.setUser(data);

      response.data = newUser
        ? { ...response.data, index: newUser.index }
        : { ...response.data, error: true, errorText: 'Auth server error' };
    }

    return response;
  },
};
