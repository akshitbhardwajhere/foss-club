import apicache from "apicache";
import { Request, Response } from "express";

const cache = apicache.middleware;

// Cache middleware that only caches if the user is not authenticated (no admin token)
// Caches responses for the specified duration (e.g., '5 minutes')
export const cachePublic = (duration: string) => {
  return cache(duration, (req: Request, res: Response) => {
    // Determine if it's an admin request
    const isAdmin = req.cookies?.jwt || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"));
    // Only cache if NOT admin
    return !isAdmin && res.statusCode === 200;
  });
};
