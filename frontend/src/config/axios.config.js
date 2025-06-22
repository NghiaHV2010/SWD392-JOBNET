import axios from "axios";
import { BASE_URL } from "./env.config.js";

export const axiosConfig = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})