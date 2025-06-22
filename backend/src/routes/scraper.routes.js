import { Router } from "express";
import { scaperController, scheduleScraper } from "../controllers/scraper.controller.js";

const scraperRoute = Router();

scraperRoute.get("/scrape", scheduleScraper);

export default scraperRoute;