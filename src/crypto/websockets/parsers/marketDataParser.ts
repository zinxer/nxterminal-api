// parsers/marketDataParser.ts
export function parseMarketData(rawData: string) {
    try {
        const data = JSON.parse(rawData);
        // Parsing logic goes here
        return data;
    } catch (error) {
        console.error(`Error parsing market data: ${error}`);
        throw error;
    }
}
