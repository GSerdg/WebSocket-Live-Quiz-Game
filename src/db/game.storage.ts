import { randomUUID } from 'node:crypto';
import { Question, Game } from '../types/dataStructureType';
import { generateRoomCode } from '../utils/generateRoomCode';

export const questionsStorage = {
  _questions: new Map<string, Question[]>(),

  haveQuestions(name: string) {
    return this._questions.has(name) && this._questions.get(name)!.length > 0;
  },
  getQuestions(name: string) {
    return this._questions.get(name);
  },
  setQuestions(name: string, questionsData: Question[]) {
    this._questions.set(name, questionsData);
  },
};

export const gameStorage = {
  _games: new Map<string, Game>(),
  _gameCodes: new Map<string, string>(),

  createGame(questions: Question[], hostId: string) {
    const id = randomUUID();

    let code;
    while (!code) {
      const tmpCode = generateRoomCode();

      if (!this._gameCodes.has(tmpCode)) {
        code = tmpCode;
      }
    }

    const gameData: Game = {
      id,
      code,
      hostId,
      questions,
      players: [],
      currentQuestion: -1,
      status: 'waiting',
    };

    this._games.set(id, gameData);
    this._gameCodes.set(code, id);

    return { gameId: gameData.id, code: gameData.code };
  },
};
