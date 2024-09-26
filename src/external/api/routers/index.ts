import express from "express";
import { router } from "./schedule-router";

export const routes = express.Router();

routes.use("/schedule", router);