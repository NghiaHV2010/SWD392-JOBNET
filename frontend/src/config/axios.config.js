import axios from "axios";
import { BASE_URL } from "./env.config.js";

export const axiosConfig = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
})