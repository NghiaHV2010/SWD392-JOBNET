import { Router } from "express";
import { getUserCV } from "../controllers/cv.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const cvRoute = Router();

cvRoute.get("/cv", authMiddleware, getUserCV);

export default cvRoute;