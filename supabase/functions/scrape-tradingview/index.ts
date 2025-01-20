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
      const table = $(`div:contains("${section}")`).next('table');
      
      table.find('tr').each((_, row) => {
        const name = $(row).find('td:first-child').text().trim();
        const valueText = $(row).find('td:nth-child(2)').text().trim();
        const value = parseFloat(valueText) || 0;
        const signal = $(row).find('td:last-child').text().toLowerCase().trim();
        
        if (name && (signal === 'buy' || signal === 'sell' || signal === 'neutral')) {
          indicators.push({ name, value, signal });
        }
      });
      return indicators;
    };

    // Get counts for each section
    const getCounts = (section: string) => {
      const table = $(`div:contains("${section}")`).next('table');
      const buy = table.find('.buy, .strongBuy').length;
      const sell = table.find('.sell, .strongSell').length;
      const neutral = table.find('.neutral').length;
      
      let signal = 'neutral';
      if (buy > sell && buy > neutral) signal = 'buy';
      if (sell > buy && sell > neutral) signal = 'sell';

      return { buy, sell, neutral, signal };
    };

    const oscillatorsData = parseIndicators('Oscillators');
    const movingAveragesData = parseIndicators('Moving Averages');

    console.log('Oscillators data:', oscillatorsData);
    console.log('Moving Averages data:', movingAveragesData);

    const technicalData = {
      oscillators: {
        ...getCounts('Oscillators'),
        indicators: oscillatorsData
      },
      movingAverages: {
        ...getCounts('Moving Averages'),
        indicators: movingAveragesData
      },
      summary: {
        ...getCounts('Summary')
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