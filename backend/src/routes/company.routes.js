import { Router } from "express";
import { getAllCompanies, getCompanyByID } from "../controllers/company.controller.js";

const companyRoute = Router();

companyRoute.get("/company", getAllCompanies);

companyRoute.get("/company/:id", getCompanyByID);

export default companyRoute;