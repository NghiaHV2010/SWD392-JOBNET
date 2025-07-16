import { HTTP_ERROR, HTTP_SUCCESS } from '../constants/httpCode.js';
import { createRequire } from 'module';
import { errorHandler } from '../utils/error.js';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

export const getAllCompanies = async (req, res, next) => {
    try {
        const companies = await prisma.companies.findMany();

        return res.status(HTTP_SUCCESS.OK).json({
            data: companies
        })
    } catch (error) {
        next(error);
    }
}

export const getCompanyByID = async (req, res, next) => {
    try {        
        const company = await prisma.companies.findFirst({
            where: {
                id: req.params?.id
            }
        });

        if(!company) {
            return next(errorHandler(HTTP_ERROR.NOT_FOUND, "Company not found!"))
        }

        return res.status(HTTP_SUCCESS.OK).json({
            data: company
        })
    } catch (error) {
        next(error);
    }
}