import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Mongo
const MONGODB_URI = process.env.MONGODB_URI; // e.g. mongodb://user:pass@mongo:27017/chatbot?authSource=admin
const MONGODB_DB = process.env.MONGODB_DB || "chatbot";

// LLM (OpenAI example)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let db, conversations;

async function initMongo() {
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(MONGODB_DB);
  conversations = db.collection("conversations");
  await conversations.createIndex({ createdAt: -1 });
}

// health
app.get("/healthz", (req, res) => res.json({ ok: true }));

// POST /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const message = (req.body?.message || "").trim();
    const sessionId = (req.body?.sessionId || "").trim() || undefined;

    if (!message) return res.status(400).json({ error: "message is required" });

    // Call LLM
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful chatbot. Keep answers concise." },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Sorry — no response.";

    // Store conversation
    const doc = {
      sessionId: sessionId || cryptoRandomId(),
      createdAt: new Date(),
      userMessage: message,
      botReply: reply,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini"
    };

    await conversations.insertOne(doc);

    return res.json({
      sessionId: doc.sessionId,
      response: reply
    });
  } catch (err) {
    console.error("chat error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

function cryptoRandomId() {
  // simple, dependency-free id
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

initMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`backend listening on ${PORT}`));
  })
  .catch((e) => {
    console.error("failed to start:", e);
    process.exit(1);
  });

