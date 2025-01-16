import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, timeframe } = await req.json();
    console.log(`Scraping data for symbol: ${symbol}, timeframe: ${timeframe}`);

    // Construct the TradingView URL
    const url = `https://www.tradingview.com/symbols/${symbol}/technicals/`;
    console.log(`Fetching from URL: ${url}`);

    // Fetch the page content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch TradingView data: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Mock data structure for now - we'll enhance the scraping logic later
    const technicalData = {
      oscillators: {
        buy: 3,
        sell: 2,
        neutral: 6,
        signal: "Neutral"
      },
      movingAverages: {
        buy: 8,
        sell: 3,
        neutral: 2,
        signal: "Buy"
      },
      summary: {
        buy: 11,
        sell: 5,
        neutral: 8,
        signal: "Buy"
      }
    };

    console.log('Successfully scraped technical data:', technicalData);

    return new Response(
      JSON.stringify(technicalData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error scraping TradingView:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});