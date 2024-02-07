import { Request, Response } from 'express';
import * as errorCodes from '../constants/errorCodes'

// DB declaration
import Config from '../models/configs';

export async function getSetupConfig(req: Request, res: Response): Promise<void> {
    try {
        const configRes: { [key: string]: any } = {};
        // get all config from db
        const Configs = await Config.findAll();
        for (const config of Configs) {
            const key = config.key
            const value = config.value

            if (key === 'HUB_API_BASEURL') { configRes['HUB_API_BASEURL'] = value }
            if (key === 'HUB_WSS_BASEURL') { configRes['HUB_WSS_BASEURL'] = value }
        }

        res.status(200).json({ success: true, data: configRes })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": { "code": errorCodes }
        })
    }
}