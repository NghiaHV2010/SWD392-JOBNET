import { config } from "dotenv";

config({ path: '.env' });

export const {
    PORT,
    DATABASE_URL,
    BRIGHT_DATA_URL,
    ACCESS_SECRET,
    REFRESH_SECRET,
    OPENAI_API_KEY,
    GEMINI_API_KEY
} = process.env;