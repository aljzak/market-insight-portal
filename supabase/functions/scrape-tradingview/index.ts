import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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
      console.log(`Parsing ${section} section`);
      
      // Find all tables and iterate through them to find the one containing our data
      $('table').each((_, table) => {
        const tableHtml = $(table).html();
        console.log(`Found table: ${tableHtml?.substring(0, 100)}...`);
        
        // Check if this table contains our section
        const headerText = $(table).prev('div').text();
        if (headerText.includes(section)) {
          $(table).find('tr').each((_, row) => {
            const name = $(row).find('td:first-child').text().trim();
            const valueText = $(row).find('td:nth-child(2)').text().trim();
            const value = parseFloat(valueText) || 0;
            const signalText = $(row).find('td:last-child').text().toLowerCase().trim();
            
            // Map TradingView's signal text to our expected values
            let signal = 'neutral';
            if (signalText.includes('buy') || signalText.includes('strong buy')) signal = 'buy';
            if (signalText.includes('sell') || signalText.includes('strong sell')) signal = 'sell';
            
            if (name && value !== undefined) {
              console.log(`Found indicator: ${name}, value: ${value}, signal: ${signal}`);
              indicators.push({ name, value, signal });
            }
          });
        }
      });
      
      console.log(`Found ${indicators.length} indicators for ${section}`);
      return indicators;
    };

    // Get counts for each section
    const getCounts = (section: string) => {
      let buy = 0;
      let sell = 0;
      let neutral = 0;
      
      $('table').each((_, table) => {
        const headerText = $(table).prev('div').text();
        if (headerText.includes(section)) {
          $(table).find('tr').each((_, row) => {
            const signalText = $(row).find('td:last-child').text().toLowerCase().trim();
            if (signalText.includes('buy') || signalText.includes('strong buy')) buy++;
            else if (signalText.includes('sell') || signalText.includes('strong sell')) sell++;
            else neutral++;
          });
        }
      });
      
      let signal = 'neutral';
      if (buy > sell && buy > neutral) signal = 'buy';
      if (sell > buy && sell > neutral) signal = 'sell';

      console.log(`${section} counts - Buy: ${buy}, Sell: ${sell}, Neutral: ${neutral}`);
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