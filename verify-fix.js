
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

async function verify() {
    const env = loadEnv();
    const apiKey = env.VITE_GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
        console.error("No API key");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const candidates = [
        "models/gemini-2.0-flash-lite-001",
        "models/gemini-2.5-flash",
        "models/gemini-2.0-flash-exp"
    ];

    for (const modelName of candidates) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello!");
            const response = await result.response;
            console.log(`✅ Success with ${modelName}! Response:`, response.text());
            return;
        } catch (error) {
            console.error(`❌ Failed with ${modelName}:`, error.message);
        }
    }
    console.log("All candidates failed.");
    process.exit(1);
}

verify();
