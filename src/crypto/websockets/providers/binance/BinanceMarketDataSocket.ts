// src/providers/binance/BinanceWebSocket.ts
import WebSocket from 'ws';

export class BinanceWebSocket {
    private ws: WebSocket | null = null;
    private reconnectInterval: NodeJS.Timeout | null = null;
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts = 5;

    constructor(private url: string, private processData: (data: string) => string, private broadcast: (data: string) => void) {}

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => this.onOpen());
        this.ws.on('message', (data) => this.onMessage(data.toString()));
        this.ws.on('close', () => this.onClose());
        this.ws.on('error', (error) => this.onError(error));
    }

    private onOpen() {
        console.log(`Connected to ${this.url}`);
        this.reconnectAttempts = 0;
    }

    private onMessage(data: string) {
        const processedData = this.processData(data);
        this.broadcast(processedData);
    }

    private onClose() {
        console.log(`Disconnected from ${this.url}`);
        this.attemptReconnect();
    }

    private onError(error: Error) {
        console.error(`WebSocket error: ${error.message}`);
        this.attemptReconnect();
    }

    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnect attempts reached.');
            return;
        }

        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
        }

        this.reconnectInterval = setTimeout(() => {
            console.log(`Reconnecting to ${this.url} (attempt ${this.reconnectAttempts + 1})...`);
            this.reconnectAttempts++;
            this.connect();
        }, this.calculateReconnectDelay());
    }

    private calculateReconnectDelay(): number {
        return Math.min(100 * (2 ** this.reconnectAttempts), 30000);
    }
}
