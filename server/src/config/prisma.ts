import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton Instance
 * 
 * Instantiates the client once for reuse across the application.
 * Reusing a single instance prevents exhausting the database's connection pool limits.
 */
const prisma = new PrismaClient();

export default prisma;
