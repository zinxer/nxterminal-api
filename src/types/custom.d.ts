// Import Express types
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Extend Express Request interface
declare module 'express-serve-static-core' {
  interface Request {
    clientIp?: string; 
    user?: JwtPayload | string;
  }
}