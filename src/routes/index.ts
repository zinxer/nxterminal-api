import express, { Request, Response, NextFunction } from 'express';
import rateLimit from "express-rate-limit";

import apiRoutes from './apiRoutes';

const router = express.Router();

const setRateLimit = (count: number) => {
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

// Comment the following block if you want to disable the request payload check.
router.use((req: Request, res: Response, next: NextFunction) => {
    if (!isParamsSafe(req.body) || !isParamsSafe(req.params) || !isParamsSafe(req.query)) {
        console.log("Suspicious Payload In Route: " + req.url);
        res.status(401).json({
            status: false,
            message: 'Suspicious Activity Detected'
        });
        return;
    }
    next();
});

// API ROUTES
router.use('/api', setRateLimit(600), apiRoutes);

export default router;
