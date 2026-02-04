import { GeminiProvider } from "./gemini.provider";
import dotenv from "dotenv";

dotenv.config();

const provider = new GeminiProvider(process.env.GEMINI_API_KEY || "");

export default provider;
