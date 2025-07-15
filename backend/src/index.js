import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.config.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import uploadRoute from "./routes/upload.routes.js";
import cors from "cors";
import scraperRoute from "./routes/scraper.routes.js";
import authRoute from "./routes/auth.routes.js";
import companyRoute from "./routes/company.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/v1/", uploadRoute);
app.use("/api/v1/", scraperRoute);
app.use("/api/v1/", authRoute);
app.use("/api/v1/", companyRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on PORT:http://localhost:${PORT}`);
})