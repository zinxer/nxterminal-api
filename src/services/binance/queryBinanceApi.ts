import { Request } from 'express';
import axios from 'axios';

import { processKlinesData } from './parserBinanceApi'

// DB declaration
import Config from '../../models/configs';

export async function getBinanceKlines(req: Request) {
    const symbol = (req.query.symbol as string).toUpperCase()
    const interval = req.query.interval

    // Retrieve BINANCE SPOT API BASEURL
    const baseUrl = (await Config.findOne({ where: { key: 'BINANCE_SPOT_API_BASEURL' } }))?.value;

    // Construct the base URL
    let url = `${baseUrl}uiKlines?symbol=${symbol}&interval=${interval}`;

    // Append optional parameters if they are provided
    if (req.query.startTime) url += `&startTime=${req.query.startTime}`;
    if (req.query.endTime) url += `&endTime=${req.query.endTime}`;
    if (req.query.timeZone) url += `&timeZone=${req.query.timeZone}`;
    if (req.query.limit) url += `&limit=${req.query.limit}`;

    try {
        const response = await axios.get(url);
        let processedKlinesData = processKlinesData(response.data)
        if (processedKlinesData) { return processedKlinesData }

        return response.data
    } catch (error) {
        console.error(`-E- Unable to retrieve klines market data from Binance`, error)
    }
}