import { Request, Response } from 'express';
import insertLog from '../services/logService'
import * as actionCodes from '../constants/actionCodes'

export async function createUser(req: Request, res: Response): Promise<void> {

}

export async function getUser(req: Request, res: Response): Promise<void> {
    // TODO: get user account details
}