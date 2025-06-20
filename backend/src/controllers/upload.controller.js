import { extractTextFromCV } from "../utils/fileReader.js";

export const uploadFile = async (req, res, next) => {
    try {
        console.log(req.file);

        const filePath = req.file.path;
        const cvText = await extractTextFromCV(filePath, req.file.mimetype);
        console.log(cvText);

    } catch (error) {
        next(error);
    }
}

