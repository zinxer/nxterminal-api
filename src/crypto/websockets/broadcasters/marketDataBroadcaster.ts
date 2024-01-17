// broadcasters/marketDataBroadcaster.ts
import WebSocket from 'ws';

export function broadcastMarketData(wss: WebSocket.Server, data: any) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
