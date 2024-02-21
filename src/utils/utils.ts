import { Request } from "express";
import md5 from "md5";



/*
export function getClientIp(req: Request): string {
    // If using `trust proxy` and the `X-Forwarded-For` header exists, `req.ips` will be populated.
    // The client's IP would be the first one in the array.
  if (Array.isArray(req.ips) && req.ips.length > 0) {
    return req.ips[0]; // Return the first IP from the array if available
  }
  
    // If the request contains the IP address directly (not behind a reverse proxy),
    // or `trust proxy` is not set, `req.ip` contains the remote IP address.
    // For dual-stack hosts (IPv4-mapped IPv6 address), we might want to format it to IPv4.
    // However, Express usually handles this, and `req.ip` should be in a usable format.
    let ip = req.ip || '';
  
    // Remove IPv6 prefix if present (for mapped IPv4 addresses in dual-stack environments)
    if (ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
      }
  
    return ip;
  }
  */

/**
* Converts a MySQL datetime string to epoch time in seconds.
* @param {string} mysqlDatetime - The datetime string from MySQL.
* @returns {number} Epoch time in seconds.
*/
export function mysqlDatetimeToEpoch(mysqlDatetime: Date) {
  return Math.floor(new Date(mysqlDatetime).getTime() / 1000);
}

export function generateUid(array: string[]): string {
  return md5(array.join('') + Date.now()).substring(0, 6);
}

export function generateTradeAccountId(userId: string, currency: string) {
  return md5(userId + currency).substring(0, 6);
}

export function generateTxUid(array: string[], type: string) {
  // Generate a unique transaction ID using the array of strings and the current time in seconds to prevent collisions

  if (type === 'financial_transactions') {
    return 'f' + md5(array.join('') + Math.floor(Date.now() / 1000)).substring(0, 11);
  } else if (type === 'trade_transactions') {
    return 't' + md5(array.join('') + Math.floor(Date.now() / 1000)).substring(0, 11);
  } else {
    return 'u' + md5(array.join('') + Math.floor(Date.now() / 1000)).substring(0, 11);
  }
}
