import { HTTP_SUCCESS } from '../constants/httpCode.js';
import { createRequire } from 'module';
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