import { Request, Response, NextFunction } from 'express';
import rateLimit from "express-rate-limit";
import * as errorCodes from '../constants/errorCodes'

// Comment the following block if you want to disable the request payload validation.
export function validatePayload(req: Request, res: Response, next: NextFunction): void {
    if (!isParamsSafe(req.body) || !isParamsSafe(req.params) || !isParamsSafe(req.query)) {
        console.log("Suspicious Payload In Route: " + req.url);
        res.status(401).json({
            success: false,
            error: { code: errorCodes.ERROR_CODE_SUSPICIOUS_PAYLOAD }
        });
        return;
    }
    next();
}

export function validateMandatoryParams(params: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req, res, next): void => {
        for (const param of params) {
            if (!req.query[param] && !req.body[param] && !req.params[param]) {
                res.status(400).json({
                    success: false,
                    error: { code: errorCodes.ERROR_CODE_INVALID_PARAMS, message: 'Missing mandatory query parameter: ' + param }
                });
                return
            }
        }
        next();
    };
}

export function validateBrokerApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-broker-api-key'];

    if (!apiKey) {
        res.status(401).json({ success: false, message: 'Broker API key is required' });
        return
    }

    if (apiKey !== process.env.BROKER_API_KEY) {
        res.status(403).json({ success: false, message: 'Invalid broker API key' });
        return
    }

    next();
}

export function setRateLimit(count: number) {
    return rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: count
    });
};


const isParamsSafe = (param: any): boolean => {
    // Whitelisted Characters Allowed in Params
    const regex = /^[A-Za-z0-9 \/,@&_:.%$#*=-]*$/;

    for (const key in param) {
        let val = param[key];
        if (isValidJSONString(val)) {
            val = JSON.parse(val);
        }
        if (val && typeof val === 'object' && val.constructor === Object) {
            if (!isParamsSafe(val)) {
                return false;
            }
        } else if (typeof val === 'string' && !regex.test(val)) {
            console.log("Param Value Rejected: " + val);
            return false;
        }
    }
    return true;
};

const isValidJSONString = (str: string): boolean => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};