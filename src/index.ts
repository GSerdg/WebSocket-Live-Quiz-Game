import { WebSocketServer } from 'ws';
import { handleMessage } from './handlers/handler';
import { CommandType, ExtendedWebSocket } from './types/dataStructureType';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const wss = new WebSocketServer({ port: PORT });

wss.on('listening', () => {
  console.log(`Server started on ws://localhost:${PORT}`);
});

wss.on('connection', ws => {
  console.log('New client connected');

  ws.on('message', raw => {
    try {
      const message = JSON.parse(raw.toString());
      const response = handleMessage(message);

      if (response?.type === CommandType.REG && !response.data.error) {
        (ws as unknown as ExtendedWebSocket).userId = response.data.index;
      }

      ws.send(JSON.stringify(response));
    } catch (e) {
      console.error('Parse error');
    }
  });
});
