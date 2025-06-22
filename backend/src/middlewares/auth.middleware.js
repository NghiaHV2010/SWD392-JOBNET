import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { HTTP_ERROR } from "../constants/httpCode.js";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/env.config.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../generated/prisma/client');

const authMiddleware = async (req, res, next) => {
    const prisma = new PrismaClient()

    let newAccessToken;
    let userId;

    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return next(errorHandler(HTTP_ERROR.UNAUTHORIZED, "Unauthorized - Please login!"));
            }

            const refreshTokenDecoded = jwt.verify(refreshToken, REFRESH_SECRET);

            if (!refreshTokenDecoded) {
                return next(errorHandler(HTTP_ERROR.UNAUTHORIZED, "Unauthorized - Invalid token!"))
            }

            userId = refreshToken.userId;

            newAccessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "45m" });
            res.cookie("accessToken", newAccessToken, {
                maxAge: 45 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: false
            })
        } else {
            const accessTokenDecoded = jwt.verify(accessToken, ACCESS_SECRET);

            if (!accessTokenDecoded) {
                return next(errorHandler(HTTP_ERROR.UNAUTHORIZED, "Unauthorized - Invalid token!"));
            }

            userId = accessTokenDecoded.userId;
        }

        const user = await prisma.users.findFirst({
            where: {
                id: userId
            },
            omit: {
                password: true
            }
        });

        if(!user) {
            next(errorHandler(HTTP_ERROR.NOT_FOUND, "User not found!"));
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

export default authMiddleware;