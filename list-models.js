import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, ".env.local");
        if (!fs.existsSync(envPath)) return {};
        const envContent = fs.readFileSync(envPath, "utf-8");
        const envVars = {};
        envContent.split("\n").forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                envVars[match[1].trim()] = value;
            }
        });
        return envVars;
    } catch (error) {
        return {};
    }
}

const env = loadEnv();
const key = env.VITE_GOOGLE_GENAI_API_KEY;

if (!key) {
    console.error("No API Key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log("Fetching models...");

fetch(url)
    .then(async (res) => {
        const data = await res.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("Error response:", JSON.stringify(data, null, 2));
        }
    })
    .catch(err => console.error("Fetch error:", err));
