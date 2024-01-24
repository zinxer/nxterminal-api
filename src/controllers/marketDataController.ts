import { Request, Response } from 'express';
import * as errorCodes from '../constants/errorCodes'
import { getBinanceKlines } from '../services/binance/queryBinanceApi';

// DB declaration
import Symbol from '../models/symbols';

export async function getKlines(req: Request, res: Response): Promise<void> {
    try {
        //get provider
        let symbolRow = await Symbol.findOne({ where: { symbol: req.query.symbol, isActive: true } });
        if (!symbolRow) {
            res.status(400).json({
                "success": false,
                "error": { "code": errorCodes.ERROR_CODE_INVALID_PARAMS, message: `${req.query.symbol} not supported.` }
            })
            return
        }

        if (symbolRow.provider === 'binance') {
            let klines = await getBinanceKlines(req)
            res.status(200).json(klines)
        }

        res.status(400).json({
            "success": false,
            "error": { "code": errorCodes.ERROR_CODE_SERVER_FAILED, message: `Unable to find to process request.` }
        })
        return
    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": { "code": errorCodes }
        })
    }
}