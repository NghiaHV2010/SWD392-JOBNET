import jwt from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/env.config.js";

export const generateToken = (userId, response) => {
    const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "45m" });
    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "1d" });

    response.cookie("accessToken", accessToken, {
        maxAge: 45 * 60 * 1000, //milisecond
        httpOnly: true, //prevent XSS attacks cross-site scriptiong attacks
        sameSite: "strict", //CSRF attacks cross-site request forgery attacks
        secure: false //https = true | http = false
    });

    response.cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: false
    });
}