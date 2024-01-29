import express, { Request, Response, NextFunction } from 'express';
import { validateMandatoryParams } from '../middleware/validationMiddleware';
import * as errorCodes from '../constants/errorCodes'
import * as path from 'path';
import { promises as fs } from 'fs';


const router = express.Router();

// Define routes
router.get('/crypto/:asset', async (req: Request, res: Response) => {
    const asset = req.params.asset;
    if (!asset) {
        res.status(400).json({
            success: false,
            error: { code: errorCodes.ERROR_CODE_INVALID_PARAMS, message: 'Missing mandatory query parameter: asset' }
        });
    }

    const filePath = path.join(__dirname, '../assets/crypto', `${asset}.svg`);
    try {
        // Check if the file exists
        await fs.access(filePath);
    } catch (error) {
        res.status(404).json(`${asset} logo not available`);
        return
    }
    res.sendFile(filePath);
});

router.get('/stock/:asset', async (req: Request, res: Response) => {
    const asset = req.params.asset;
    if (!asset) {
        res.status(400).json({
            success: false,
            error: { code: errorCodes.ERROR_CODE_INVALID_PARAMS, message: 'Missing mandatory query parameter: asset' }
        });
    }

    const filePath = path.join(__dirname, '../assets/stock', `${asset}.svg`);
    try {
        // Check if the file exists
        await fs.access(filePath);
    } catch (error) {
        res.status(404).json(`${asset} logo not available`);
    }
    res.sendFile(filePath);
});

router.get('/forex/:asset', async (req: Request, res: Response) => {
    const asset = req.params.asset;
    if (!asset) {
        res.status(400).json({
            success: false,
            error: { code: errorCodes.ERROR_CODE_INVALID_PARAMS, message: 'Missing mandatory query parameter: asset' }
        });
    }

    const filePath = path.join(__dirname, '../assets/forex', `${asset}.svg`);
    try {
        // Check if the file exists
        await fs.access(filePath);
    } catch (error) {
        res.status(404).json(`${asset} logo not available`);
    }
    res.sendFile(filePath);
});

export default router;


