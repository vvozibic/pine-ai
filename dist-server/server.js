"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts — простой прокси для OpenAI через Express
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const SCADE_API_KEY = process.env.SCADE_API_KEY;
if (!SCADE_API_KEY) {
    console.error("❌ Не указан SCADE_API_KEY в .env");
    process.exit(1);
}
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../client/dist")));
app.get("*", (_, res) => res.sendFile(path_1.default.resolve(__dirname, "../client/dist/index.html")));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/chat", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)("https://app.scade.pro/api/v1/knowledge-base/retrieve/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${SCADE_API_KEY}`,
            },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }
    catch (error) {
        console.error("Ошибка запроса к OpenAI:", error);
        res.status(500).json({ error: "Ошибка при обращении к OpenAI API" });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Прокси-сервер запущен на http://localhost:${PORT}`);
});
