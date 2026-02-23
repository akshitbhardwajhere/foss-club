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
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalEvents = yield prisma_1.default.event.count();
        const upcomingEvents = yield prisma_1.default.event.count({
            where: {
                date: {
                    gt: new Date(),
                },
            },
        });
        const pastEvents = yield prisma_1.default.event.count({
            where: {
                date: {
                    lte: new Date(),
                },
            },
        });
        const totalTeamMembers = yield prisma_1.default.teamMember.count();
        const totalBlogs = yield prisma_1.default.blog.count();
        res.json({
            events: {
                total: totalEvents,
                upcoming: upcomingEvents,
                past: pastEvents,
            },
            team: {
                total: totalTeamMembers,
            },
            blogs: {
                total: totalBlogs,
            },
        });
    }
    catch (error) {
        console.error("Stats fetch error:", error instanceof Error ? error.message : error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            message: "Error fetching dashboard stats",
            error: errorMessage,
        });
    }
});
exports.getDashboardStats = getDashboardStats;
