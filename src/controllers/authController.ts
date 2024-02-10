import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { updateUserWithRefreshToken } from '../services/userService'
import * as actionCodes from '../constants/actionCodes'
import * as errorCodes from '../constants/errorCodes'
import User from '../models/users';
import { insertLog } from '../services/logService'
import { Op } from 'sequelize';

export async function loginUser(req: Request, res: Response) {
  const { userId, password } = req.body;
  try {
    const user = await findUserById(userId);
    if (!user) {
      res.status(404).send({
        success: false,
        error: { code: errorCodes.ERROR_CODE_USER_NOT_FOUND },
      });
      return
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(403).send({
        success: false,
        error: { code: errorCodes.ERROR_CODE_AUTHENTICATION_FAILED },
      });
      return
    }

    // User authenticated, generate tokens
    const { accessToken, refreshToken } = generateTokens({ userId: user.id });

    // Save refreshToken with user in DB
    if (await updateUserWithRefreshToken(userId, refreshToken) === null) {
      res.status(500).send({
        success: false,
        error: { code: errorCodes.ERROR_CODE_SERVER_FAILED }
      });
      return
    }

    // Log user login action
    insertLog(user.id, actionCodes.ACTION_LOGIN, "User login", req.clientIp || null)

    res.json({
      success: true,
      data: { accessToken: accessToken, refreshToken: refreshToken }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: { code: errorCodes.ERROR_CODE_SERVER_FAILED }
    });
  }
};

export async function logoutUser(req: Request, res: Response) {
  const userId = (req as any).user.userId
  // invalidate refresh token so browser/client unable to keep access
  if (!await invalidateRefreshToken(userId)) {
    res.status(403).send({
      success: false,
      error: { code: errorCodes.ERROR_CODE_USER_ALREADY_LOGGED_OUT }
    });
    return
  }
  // log logout action
  insertLog(userId, actionCodes.ACTION_LOGOUT, 'User logout successfully', req.clientIp || null)
  res.json({
    success: true,
    message: "User logged out successfully."
  })
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (refreshToken == null) { res.sendStatus(401); return }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: any, user: any) => {
    if (err) { res.sendStatus(403); return }

    // Check if the provided refresh token is still valid and present in the DB.
    const isValidRefreshToken = await checkRefreshTokenInDatabase(user!.userId, refreshToken);
    if (!isValidRefreshToken) {
      res.status(403).send({
        success: false,
        error: { code: errorCodes.ERROR_CODE_INVALID_REFRESH_TOKEN }
      });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({ userId: user!.id });

    // Update user with new refresh token in DB
    // Save refreshToken with user in DB
    if (await updateUserWithRefreshToken(user.userId, newRefreshToken) === null) {
      res.status(500).send({
        success: false,
        error: { code: errorCodes.ERROR_CODE_SERVER_FAILED }
      });
      return
    }
    insertLog(user.userId, actionCodes.ACTION_REFRESH_TOKEN, "Refresh login token", req.clientIp || null)

    res.json({ accessToken, refreshToken: newRefreshToken });
    return
  });
};


async function findUserById(userId: string) {
  try {
    const user = await User.findOne({ where: { id: userId, isActive: true } })
    return user || null
  } catch (error) {
    console.log('-E-', error)
  }
  return null
};

// Generate JWT tokens
function generateTokens(payload: any) {
  let accessTokenExpiresIn: Object = { expiresIn: '1h' }
  let refreshTokenExpiresIn: Object = { expiresIn: '7d' }
  if (process.env.NODE_ENV === 'development') { accessTokenExpiresIn = {}; refreshTokenExpiresIn = {} }

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, accessTokenExpiresIn);
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, refreshTokenExpiresIn);
  return { accessToken, refreshToken };
};

async function invalidateRefreshToken(userId: string) {
  const updatedRows = await User.update({ refreshToken: null }, { where: { id: userId, refreshToken: { [Op.ne]: null } } });
  if (updatedRows[0] > 0) {
    return true; // Indicates that the update operation affected at least one row
  } else {
    return false; // Indicates that no rows were updated
  }
}

/**
 * Checks if the provided refresh token matches the one stored in the database for the given user ID.
 * 
 * @param userId - The ID of the user whose refresh token should be checked.
 * @param refreshToken - The refresh token to validate.
 * @returns Promise<boolean> - True if the token matches and is found, false otherwise.
 */
async function checkRefreshTokenInDatabase(userId: string, refreshToken: string): Promise<boolean> {
  try {
    const user = await User.findOne({
      where: {
        id: userId,
        refreshToken: refreshToken, // Ensure the refreshToken matches the one stored in the database
        isActive: true
      },
    });

    return !!user; // Returns true if the user and token match is found, false otherwise
  } catch (error) {
    console.error('Error checking refresh token in database:', error);
    return false; // Consider the token invalid in case of error
  }
}
