import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GEMINI_KEY_STORAGE = 'gemini_api_key';

export const getStoredGeminiKey = async (): Promise<string | null> => {
  const { data, error } = await supabase.functions.invoke('get-gemini-key');
  if (error) {
    console.error('Error fetching Gemini key:', error);
    return null;
  }
  return data?.key || null;
};

export const setGeminiKey = (key: string): void => {
  localStorage.setItem(GEMINI_KEY_STORAGE, key);
};

export const clearGeminiKey = (): void => {
  localStorage.removeItem(GEMINI_KEY_STORAGE);
};

export async function getFundamentalAnalysis(symbol: string) {
  try {
    console.log('Starting fundamental analysis for:', symbol);
    const apiKey = await getStoredGeminiKey();
    
    if (!apiKey) {
      console.log('No API key found');
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key in the settings to use fundamental analysis.",
        variant: "destructive"
      });
      return null;
    }

    console.log('Received API key, initializing Gemini');
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
      description: "Failed to fetch fundamental analysis. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
}