import { createRequire } from 'module';
import { HTTP_SUCCESS } from '../constants/httpCode.js';

const require = createRequire(import.meta.url);
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

export const getUserCV = async (req, res, next) => {
    try {
        const cv = await prisma.cvs.findFirst({
            where: {
                user_id: req.user?.id
            }
        });

        return res.status(HTTP_SUCCESS.OK).json({
            data: {
                fullname: cv.fullname,
                    email: cv.email,
                    phone: cv.phone,
                    address: cv.address,
                    skills: JSON.parse(cv.skills),
                    experience: JSON.parse(cv.experience),
                    certificates: JSON.parse(cv.certificates),
                    languages: JSON.parse(cv.languages),
                    education: JSON.parse(cv.education),
                    description: cv.summary,
                    apply_job: cv.apply_job,
                    projects: JSON.parse(cv.projects),
            }
        });
    } catch (error) {
        next(error);
    }
}