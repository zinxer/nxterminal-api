// websockets/index.ts
import http from 'http';
import WebSocket from 'ws';
import { BinanceMarketDataSocket } from './providers/binance/BinanceMarketDataSocket';
import { parseMarketData } from './parsers/marketDataParser';
import { broadcastMarketData } from './broadcasters/marketDataBroadcaster';

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    // Handle new client connection
});

// Example: Setting up a Binance Market Data Socket
const binanceMarketDataSocket = new BinanceMarketDataSocket('wss://...');
binanceMarketDataSocket.connect();

server.listen(8080, () => {
    console.log('WebSocket server listening on port 8080');
});
