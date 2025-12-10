const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();
const genai = new GoogleGenerativeAI(process.env.API_KEY);
const model = genai.getGenerativeModel({
  model: "gemini-2.0-flash", // Best for free tier
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1024,
  },
});
module.exports={model};