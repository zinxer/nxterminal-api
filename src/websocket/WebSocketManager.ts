import { Server as WebSocketServer } from 'ws';
import { Server as HttpServer } from 'http';
import { Socket as NetSocket } from 'net';

import { setupBinanceWebSocket } from './binance/setupBinanceWebSocket'

// DB declaration
import Symbol from '../models/symbols';

// Define a map to hold WebSocket server instances
const webSocketServers = new Map<string, WebSocketServer>();

export async function setupWebSocketManager(server: HttpServer) {
    server.on('upgrade', async (request, socket: NetSocket, head) => {
        const url = new URL(request.url || "/", `http://${request.headers.host}`);
        const pathname = url.pathname;
        const params = new URLSearchParams(url.search);

        if (pathname === '/ws') {
            const symbol = params.get('symbol');
            const type = params.get('type');

            if (symbol && (type === 'trade' || type === 'orderbook')) {
                const wss = await getWebSocketServer(symbol, type, socket);
                if (wss) {
                    wss.handleUpgrade(request, socket, head, (ws) => {
                        wss.emit('connection', ws, request);
                    });
                }
            } else {
                socket.destroy();
            }
        } else {
            socket.destroy()
        }
    });

    console.log("-I- WebSocket setup complete");
}

async function getWebSocketServer(symbol: string, type: string, socket: NetSocket): Promise<WebSocketServer | null> {
    // check if websocket for this had already been established
    const key = `${symbol}-${type}`;
    if (!webSocketServers.has(key)) {
        const wss = new WebSocketServer({ noServer: true });
        webSocketServers.set(key, wss);

        // Check if symbol exists and what provider it is.
        try {
            let symbolRow = await Symbol.findOne({ where: { symbol: symbol } });
            if (symbolRow) {
                if (symbolRow.provider === 'binance') {
                    console.log(`-I- Setting up "${symbol}-${type}" websocket server from ${symbolRow.provider}.`)
                    setupBinanceWebSocket(symbol, type, wss)
                } else if (symbolRow.provider === 'liquidity-provider') {
                    // for future integration with liquidity-provider
                    console.log(`-I- Setting up "${symbol}-${type}" websocket server from ${symbolRow.provider}.`)
                } else {
                    socket.destroy();
                    return null;
                }
            } else {
                socket.destroy();
                return null;
            }
        } catch (error) {
            console.error('-E- Error querying symbol:', error);
            socket.destroy();
            return null;
        }
    }
    return webSocketServers.get(key) || null;
}
