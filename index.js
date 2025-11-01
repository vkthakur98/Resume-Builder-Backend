import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ POST route for generating a professional summary
app.post("/generate-summary", async (req, res) => {
  try {
    // const { jobTitle } = req.body;
    const jobTitle = req.body.jobTitle;
    const exp_duration = req.body.exp;
    const company = req.body.company;
    if (!jobTitle) {
      return res.status(400).json({ error: "Job role is required." });
    }

    const prompt = `
    Write a professional resume summary for a ${jobTitle}. candidate has the ${exp_duration} year of experience as a ${jobTitle} in the ${company}. 
    Keep it concise (around 4-5 lines), use a confident and polished tone. Must include the expierience and company.
    don't give me outputs like "as an AI language model".`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    
    const summary = response.candidates[0].content.parts[0].text;
    res.json({ summary });

  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// ✅ Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
