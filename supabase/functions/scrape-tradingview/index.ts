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

    // Construct the TradingView URL with timeframe
    const url = `https://www.tradingview.com/symbols/${symbol}/technicals/?interval=${timeframe}`;
    console.log(`Fetching from URL: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch TradingView data: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Function to parse indicator data
    const parseIndicators = (section: string) => {
      const indicators = [];
      $(`div:contains("${section}")`)
        .closest('table')
        .find('tr')
        .each((_, row) => {
          const name = $(row).find('td:first-child').text().trim();
          const value = parseFloat($(row).find('td:nth-child(2)').text().trim()) || 0;
          const signal = $(row).find('td:last-child').text().toLowerCase().trim();
          
          if (name && (signal === 'buy' || signal === 'sell' || signal === 'neutral')) {
            indicators.push({ name, value, signal });
          }
        });
      return indicators;
    };

    // Get counts for each section
    const getCounts = (section: string) => {
      const buy = $(section).find('.buy').length;
      const sell = $(section).find('.sell').length;
      const neutral = $(section).find('.neutral').length;
      
      // Determine signal based on counts
      let signal = 'Neutral';
      if (buy > sell && buy > neutral) signal = 'Buy';
      if (sell > buy && sell > neutral) signal = 'Sell';
      if (buy >= sell * 2) signal = 'Strong Buy';
      if (sell >= buy * 2) signal = 'Strong Sell';

      return { buy, sell, neutral, signal };
    };

    const oscillatorsData = parseIndicators('Oscillators');
    const movingAveragesData = parseIndicators('Moving Averages');

    const technicalData = {
      oscillators: {
        ...getCounts('.oscillators-data'),
        indicators: oscillatorsData
      },
      movingAverages: {
        ...getCounts('.moving-averages-data'),
        indicators: movingAveragesData
      },
      summary: {
        ...getCounts('.summary-data')
      }
    };

    console.log('Successfully scraped technical data:', JSON.stringify(technicalData));

    return new Response(JSON.stringify(technicalData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error scraping TradingView:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});