"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/**
 * Prisma Client Singleton Instance
 *
 * Instantiates the client once for reuse across the application.
 * Reusing a single instance prevents exhausting the database's connection pool limits.
 */
const prisma = new client_1.PrismaClient();
exports.default = prisma;
