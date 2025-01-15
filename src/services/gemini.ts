import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "@/components/ui/use-toast";

const GEMINI_KEY_STORAGE = 'GEMINI_API_KEY';

export const getStoredGeminiKey = () => {
  return localStorage.getItem(GEMINI_KEY_STORAGE);
};

export const setGeminiKey = (key: string) => {
  localStorage.setItem(GEMINI_KEY_STORAGE, key);
};

export const clearGeminiKey = () => {
  localStorage.removeItem(GEMINI_KEY_STORAGE);
};

export async function getFundamentalAnalysis(symbol: string) {
  try {
    const apiKey = getStoredGeminiKey();
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key in the settings to access fundamental analysis.",
        variant: "destructive"
      });
      return null;
    }

    console.log('Initializing Gemini API with key');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Provide a fundamental analysis for ${symbol} including:
    1. Market Cap
    2. P/E Ratio
    3. Revenue Growth
    4. Key Metrics
    5. Recent News Impact
    Format the response as JSON.`;

    console.log('Sending request to Gemini API');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Successfully received Gemini API response');
    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting fundamental analysis:', error);
    toast({
      title: "Analysis Error",
      description: "Failed to fetch fundamental analysis. Please check your API key and try again.",
      variant: "destructive"
    });
    return null;
  }
}