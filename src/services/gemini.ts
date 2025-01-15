import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getFundamentalAnalysis(symbol: string) {
  try {
    // Initialize the Gemini API with your API key
    const genAI = new GoogleGenerativeAI(localStorage.getItem('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Provide a fundamental analysis for ${symbol} including:
    1. Market Cap
    2. P/E Ratio
    3. Revenue Growth
    4. Key Metrics
    5. Recent News Impact
    Format the response as JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting fundamental analysis:', error);
    return null;
  }
}