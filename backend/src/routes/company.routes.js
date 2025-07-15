import { Router } from "express";
import { getAllCompanies } from "../controllers/company.controller.js";

const companyRoute = Router();

companyRoute.get("/company", getAllCompanies);

export default companyRoute;