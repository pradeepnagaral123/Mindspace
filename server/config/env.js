import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load server/.env before any other module reads process.env
dotenv.config({ path: path.join(__dirname, "../.env") });

// Fallback: project root .env (holds GROK_API etc.). dotenv never overrides keys already set above.
dotenv.config({ path: path.join(__dirname, "../../.env") });
