const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'https://resume-builder-frontend-wagi.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Server is running on ${PORT}`);
});

app.post('/generate-summary', async (req, res) => {
  const { jobTitle,company, experience } = req.body;

  if (!jobTitle) {
    return res.status(400).json({ error: 'Missing jobTitle' });
  }

  const prompt = `Write a concise and engaging professional summary for a resume in 80 words. 
The candidate is applying for the position of ${jobTitle} and has ${experience} years of experience at ${company}. 
Be sure to include the company name, ${company}, and highlight the candidate’s strengths, professionalism, and motivation for this role. 
Output only the professional summary text. Do not include introductions, explanations, or extra words.
`;
  try {
    const response = await axios.post(
      'https://api.cohere.ai/generate',
      {
        model: "command",
        prompt,
        max_tokens: 150,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE",
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    ); 

     console.log("Cohere API Response:", response.data.text);
    const summary = response.data.text;
    res.json({ summary: summary });
  } catch (error) {
    console.error("Cohere API error:", error.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

//Server started
