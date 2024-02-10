// Import Express types
import { Request } from 'express';

// Extend Express Request interface
declare module 'express-serve-static-core' {
  interface Request {
    clientIp?: string; // Make clientIp optional to ensure compatibility with all requests
  }
}