"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to explicitly connect to the database via Prisma
        yield prisma_1.default.$connect();
        console.log('PostgreSQL (Supabase) Connected Successfully');
    }
    catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        console.error('Note: If you are seeing connection timeouts, you likely need to use the IPv4 connection pooling string from Supabase instead of the direct db.[projectId].supabase.co string.');
        process.exit(1);
    }
});
exports.default = connectDB;
