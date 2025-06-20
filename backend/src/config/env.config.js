import { config } from "dotenv";

config({ path: '.env' });

export const {
    PORT,
    DATABASE_URL,
    BRIGHT_DATA_URL
} = process.env;