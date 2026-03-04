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
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getNextEvent = exports.getEvents = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const cloudinary_1 = require("../utils/cloudinary");
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma_1.default.event.findMany({
            orderBy: { createdAt: "desc" },
            include: { registrationConfig: true },
        });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getEvents = getEvents;
const getNextEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nextEvent = yield prisma_1.default.event.findFirst({
            where: {
                date: {
                    gt: new Date(), // Only events in the future
                },
            },
            orderBy: {
                date: "asc", // Get the chronologically closest one first
            },
            include: { registrationConfig: true },
        });
        // It's perfectly normal for this to be null if there are no upcoming events
        res.json(nextEvent);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getNextEvent = getNextEvent;
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const event = yield prisma_1.default.event.findUnique({
            where: { id },
            include: { registrationConfig: true },
        });
        if (event) {
            res.json(event);
        }
        else {
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getEventById = getEventById;
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, date, location, imageUrl } = req.body;
        const event = yield prisma_1.default.event.create({
            data: {
                title,
                description,
                category,
                date: new Date(date),
                location,
                imageUrl,
            },
        });
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.createEvent = createEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, date, location, imageUrl } = req.body;
        const id = req.params.id;
        const eventExists = yield prisma_1.default.event.findUnique({ where: { id } });
        if (eventExists) {
            if (imageUrl !== undefined &&
                eventExists.imageUrl &&
                imageUrl !== eventExists.imageUrl) {
                yield (0, cloudinary_1.deleteCloudinaryImage)(eventExists.imageUrl);
            }
            const updatedEvent = yield prisma_1.default.event.update({
                where: { id },
                data: {
                    title: title || undefined,
                    description: description || undefined,
                    category: category || undefined,
                    date: date ? new Date(date) : undefined,
                    location: location || undefined,
                    imageUrl: imageUrl === "" ? null : imageUrl || undefined,
                },
            });
            res.json(updatedEvent);
        }
        else {
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const eventExists = yield prisma_1.default.event.findUnique({ where: { id } });
        if (eventExists) {
            if (eventExists.imageUrl) {
                yield (0, cloudinary_1.deleteCloudinaryImage)(eventExists.imageUrl);
            }
            yield prisma_1.default.event.delete({ where: { id } });
            res.json({ message: "Event removed" });
        }
        else {
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.deleteEvent = deleteEvent;
