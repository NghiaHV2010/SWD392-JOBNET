import { Router } from "express"
import { uploadFile } from "../controllers/upload.controller.js";
import multer from "multer";

const uploadRoute = Router();
const upload = multer({ dest: 'uploads/' });

uploadRoute.post("/upload-cv", upload.single('cv'), uploadFile);

export default uploadRoute;