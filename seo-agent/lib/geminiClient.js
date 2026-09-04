// lib/geminiClient.js
//
// Shared wrapper client for Google Generative AI (Gemini).
// Reads the API key from GEMINI_API_KEY environment variable.

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && process.env.NODE_ENV !== "test") {
  // Warning if API key is not present when loaded, but allow module import
  if (process.env.DEBUG) {
    console.warn("Warning: GEMINI_API_KEY is not set in environment variables.");
  }
}

const genAI = new GoogleGenerativeAI(apiKey || "");

/**
 * Calls Gemini model (gemini-2.5-flash) with a text prompt and returns the raw text output.
 * @param {string} prompt
 * @param {object} options
 * @returns {Promise<string>}
 */
async function generateText(prompt, options = {}) {
  const modelName = options.model || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens || 2048,
    },
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Calls Gemini model and parses the returned JSON string.
 * Automatically cleans markdown code fences if present.
 * @param {string} prompt
 * @param {object} options
 * @returns {Promise<object>}
 */
async function generateJson(prompt, options = {}) {
  const rawText = await generateText(prompt, options);
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // If direct parse fails, try extracting first JSON block
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error(`Failed to parse JSON response from Gemini: ${err.message}\nRaw output:\n${rawText}`);
  }
}

module.exports = {
  genAI,
  generateText,
  generateJson,
};
