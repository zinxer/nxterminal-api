import WebSocket, { Server as WebSocketServer } from 'ws';
import { processDataForType } from './parserBinanceWebSocket'

let reconnectInterval: NodeJS.Timeout | null = null;
let reconnectAttempts = 0;
const connectedClientsByType = new Map<string, Set<WebSocket>>();

export function setupBinanceWebSocket(symbol: string, type: string, wss: WebSocketServer) {
    // Keep track on number of client connection by symbol and type => key
    const key = `${symbol}-${type}`
    if (!connectedClientsByType.has(key)) {
        connectedClientsByType.set(key, new Set());
    }

    const binanceWsUrl = getBinanceWsUrl(symbol, type)
    const processData = processDataForType(type)
    const binanceWs = new WebSocket(binanceWsUrl);

    wss.on('connection', (ws) => {
        // Log number of client connection by symbol and type
        const clients = connectedClientsByType.get(key);
        clients?.add(ws);
        console.log(`-I- New client(${connectedClientsByType.get(key)?.size || 0}) connected for "${key}".`)

        ws.on('close', () => {
            // Remove the client from the set when it disconnects
            clients?.delete(ws);
        });
    });

    binanceWs.on('message', (data: WebSocket.Data) => {
        const processedData = processData(data.toString());
        broadcastToClients(wss, processedData);
    });

    binanceWs.on('open', () => {
        console.log(`-I- Connected to feed provider: ${binanceWsUrl}`);
        reconnectAttempts = 0;
    });

    binanceWs.on('ping', (data: WebSocket.Data) => {
        binanceWs.pong(data);
    });

    binanceWs.on('close', () => {
        console.log(`-I- Disconnected from feed provider: ${binanceWsUrl}. Attempting to reconnect...`);
        attemptReconnect(symbol, type, wss);
    });

    binanceWs.on('error', (error: Error) => {
        console.error('-E- WebSocket error from feed provider ${binanceWsUrl}:', error);
        attemptReconnect(symbol, type, wss);
    });
}

function getBinanceWsUrl(symbol: string, type: string): string {
    return `${process.env.BINANCE_WSS_BASEURL}${symbol}@${type}`;
}

function broadcastToClients(wss: WebSocketServer, data: string): void {
    wss.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(data);
        }
    });
}

function attemptReconnect(symbol: string, type: string, wss: WebSocketServer) {
    if (reconnectInterval) {
        clearTimeout(reconnectInterval);
    }

    const delay = Math.min(100 * (2 ** reconnectAttempts), 30000);
    reconnectInterval = setTimeout(() => {
        console.log(`-I- Reconnecting to Binance WebSocket (attempt ${reconnectAttempts + 1})...`);
        setupBinanceWebSocket(symbol, type, wss);
        reconnectAttempts++;
    }, delay);
}