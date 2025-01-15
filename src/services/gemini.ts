import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "@/components/ui/use-toast";

export async function getFundamentalAnalysis(symbol: string) {
  try {
    console.log('Starting fundamental analysis for:', symbol);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
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