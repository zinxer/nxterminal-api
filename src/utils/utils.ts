import { Request } from "express";

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