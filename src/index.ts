import { WebSocketServer } from 'ws';

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
      // handleMessage(ws, message);
      console.log('message', message);
    } catch (e) {
      console.error('Parse error');
    }
  });
});
