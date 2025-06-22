import {config} from "dotenv"

config({path: '.env'});

export const {
    BASE_URL
} = process.env;