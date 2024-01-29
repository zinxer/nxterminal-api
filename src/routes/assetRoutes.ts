import express, { Request, Response, NextFunction } from 'express';
import { validateMandatoryParams } from '../middleware/validationMiddleware';
import * as errorCodes from '../constants/errorCodes'
import * as path from 'path';
import { promises as fs } from 'fs';


const router = express.Router();

// Define routes
router.get('/:type/:asset', async (req: Request, res: Response) => {
    const asset = req.params.asset;
    const assetType = req.params.type

    if (!asset || !assetType) {
        res.status(400).json({
            success: false,
            error: { code: errorCodes.ERROR_CODE_INVALID_PARAMS, message: 'Missing mandatory query parameter: /:type/:asset' }
        });
    }

    const basePath = path.join(__dirname, `../assets/${assetType}/${asset}`);

    // Helper function to check file existence
    async function fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    // Check for .svg and .png files
    let filePath = `${basePath}.svg`;
    if (!await fileExists(filePath)) {
        filePath = `${basePath}.png`;
        if (!await fileExists(filePath)) {
            res.status(404).json(`/${assetType}/${asset} logo not available`);
            return
        }
    }
    res.sendFile(filePath);
});

export default router;


