"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const schedule_router_1 = require("./schedule-router");
exports.routes = express_1.default.Router();
exports.routes.use("/schedule", schedule_router_1.router);
