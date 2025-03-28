// server.ts — простой прокси для OpenAI через Express
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;
const SCADE_API_KEY = process.env.SCADE_API_KEY;

if (!SCADE_API_KEY) {
  console.error("❌ Не указан SCADE_API_KEY в .env");
  process.exit(1);
}
app.use(express.static(path.resolve(__dirname, "../client/dist")));
app.get("*", (_, res) =>
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"))
);

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch(
      "https://app.scade.pro/api/v1/knowledge-base/retrieve/answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${SCADE_API_KEY}`,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Ошибка запроса к OpenAI:", error);
    res.status(500).json({ error: "Ошибка при обращении к OpenAI API" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Прокси-сервер запущен на http://localhost:${PORT}`);
});
