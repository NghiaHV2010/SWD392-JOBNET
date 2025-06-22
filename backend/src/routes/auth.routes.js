import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { checkAuth, login, logout, register } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/register", register );
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.get("/check", authMiddleware, checkAuth);

export default authRoute;