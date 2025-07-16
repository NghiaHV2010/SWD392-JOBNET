import { Router } from "express"
import { uploadFile } from "../controllers/upload.controller.js";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware.js";

const uploadRoute = Router();
const upload = multer({ dest: 'uploads/' });

uploadRoute.post("/upload-cv", upload.single('cv'), authMiddleware, uploadFile);

export default uploadRoute;