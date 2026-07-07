import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate content" });
  }
});

// For structured output (JSON schema)
app.post("/api/gemini/generate-json", async (req, res) => {
  try {
    const { prompt, systemInstruction, schema } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini JSON API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate json content" });
  }
});

// Chat session wrapper
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { history, message, systemInstruction } = req.body;
    
    const contents = history.map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));
    
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response" });
  }
});

export default app;
