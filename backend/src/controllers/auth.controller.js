import { HTTP_ERROR, HTTP_SUCCESS } from "../constants/httpCode.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import { createRequire } from 'module';
import { generateToken } from "../utils/jwt.js";
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient()

export const register = async (req, res, next) => {
    try {
        console.log(req.body);
        
        const { username, email, password } = req.body;

        const isExisted = await prisma.users.findFirst({
            where: {
                email
            },
            omit: {
                password: true
            }
        });

        if (isExisted) {
            return next(errorHandler(HTTP_ERROR.CONFLICT, "Email already existed!"));
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await prisma.users.create({
            data: {
                username,
                email,
                password: hashPassword
            }
        });

        if (user) {
            return res.status(HTTP_SUCCESS.CREATED).json({
                message: "Register successfully!"
            })
        }
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, "Invalid credentials!"));
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, "Invalid credentials!"));
        }

        generateToken(user.id, res);
        return res.status(HTTP_SUCCESS.OK).json({
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                description: user.description,
                imageUrl: user.imageUrl,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            }
        })

    } catch (error) {
        next(error);
    }
}

export const logout = (req, res) => {
    res.cookie("accessToken", '', { maxAge: 0 });
    res.cookie("refreshToken", '', { maxAge: 0 });

    return res.status(HTTP_SUCCESS.OK).json({
        message: "Logout successfully!"
    })
}

export const checkAuth = (req, res, next) => {
    try {
        res.status(HTTP_SUCCESS.OK).json({
            data: req.user
        })
    } catch (error) {
        next(error)
    }
}