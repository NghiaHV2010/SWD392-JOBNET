import {Router} from "express";
import { scaperController } from "../controllers/scraper.controller.js";

const scraperRoute = Router();

scraperRoute.get("/scrape", scaperController);

export default scraperRoute;