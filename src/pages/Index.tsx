import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SymbolSearch from '@/components/SymbolSearch';
import TimeframeSelector from '@/components/TimeframeSelector';
import PriceChart from '@/components/PriceChart';
import AnalysisGauge from '@/components/AnalysisGauge';
import AnalysisTable from '@/components/AnalysisTable';
import TechnicalIndicators from '@/components/TechnicalIndicators';
import { getFundamentalAnalysis } from '@/services/gemini';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1d');
  const { toast } = useToast();

  const { data: technicalData, isLoading: isTechnicalLoading, refetch: refetchTechnical } = useQuery({
    queryKey: ['technical', symbol, timeframe],
    queryFn: async () => {
      console.log(`Fetching technical data for ${symbol} with timeframe ${timeframe}`);
      const { data, error } = await supabase.functions.invoke('scrape-tradingview', {
        body: { symbol, timeframe }
      });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: fundamentalData, isLoading: isFundamentalLoading } = useQuery({
    queryKey: ['fundamental', symbol],
    queryFn: () => getFundamentalAnalysis(symbol)
  });

  const handleSearch = (newSymbol: string) => {
    setSymbol(newSymbol);
    toast({
      title: "Symbol Updated",
      description: `Now showing data for ${newSymbol}`,
    });
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    console.log(`Changing timeframe to ${newTimeframe}`);
    setTimeframe(newTimeframe);
    refetchTechnical(); // Explicitly refetch technical data when timeframe changes
    toast({
      title: "Timeframe Updated",
      description: `Switched to ${newTimeframe.toUpperCase()} timeframe`,
    });
  };

  if (isTechnicalLoading || isFundamentalLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading analysis...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <SymbolSearch onSearch={handleSearch} />
          <TimeframeSelector
            selectedTimeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
          />
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{symbol}</h2>
            <p className="text-muted-foreground">
              Technical Analysis - {timeframe.toUpperCase()} Timeframe
            </p>
          </div>

          {technicalData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalysisGauge
                  title="Oscillators"
                  value={technicalData.oscillators.buy}
                  total={technicalData.oscillators.buy + technicalData.oscillators.sell + technicalData.oscillators.neutral}
                  buys={technicalData.oscillators.buy}
                  sells={technicalData.oscillators.sell}
                  neutrals={technicalData.oscillators.neutral}
                  signal={technicalData.oscillators.signal as any}
                />
                <AnalysisGauge
                  title="Moving Averages"
                  value={technicalData.movingAverages.buy}
                  total={technicalData.movingAverages.buy + technicalData.movingAverages.sell + technicalData.movingAverages.neutral}
                  buys={technicalData.movingAverages.buy}
                  sells={technicalData.movingAverages.sell}
                  neutrals={technicalData.movingAverages.neutral}
                  signal={technicalData.movingAverages.signal as any}
                />
                <AnalysisGauge
                  title="Summary"
                  value={technicalData.summary.buy}
                  total={technicalData.summary.buy + technicalData.summary.sell + technicalData.summary.neutral}
                  buys={technicalData.summary.buy}
                  sells={technicalData.summary.sell}
                  neutrals={technicalData.summary.neutral}
                  signal={technicalData.summary.signal as any}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalysisTable 
                  title="Oscillators" 
                  items={[
                    // We'll need to update this with actual data from the scraping
                    { name: 'RSI (14)', value: 0, signal: 'neutral' as const },
                    { name: 'Stochastic %K (14, 3, 3)', value: 0, signal: 'neutral' as const },
                    { name: 'CCI (20)', value: 0, signal: 'neutral' as const },
                    { name: 'ADX (14)', value: 0, signal: 'neutral' as const },
                    { name: 'AO', value: 0, signal: 'neutral' as const },
                    { name: 'Momentum (10)', value: 0, signal: 'neutral' as const },
                    { name: 'MACD Level (12, 26)', value: 0, signal: 'neutral' as const },
                    { name: 'Stochastic RSI Fast (3, 3, 14, 14)', value: 0, signal: 'neutral' as const },
                    { name: 'Williams %R (14)', value: 0, signal: 'neutral' as const },
                    { name: 'Bull Bear Power', value: 0, signal: 'neutral' as const }
                  ]} 
                />
                <AnalysisTable 
                  title="Moving Averages" 
                  items={[
                    // We'll need to update this with actual data from the scraping
                    { name: 'EMA 10', value: 0, signal: 'neutral' as const },
                    { name: 'SMA 10', value: 0, signal: 'neutral' as const },
                    { name: 'EMA 20', value: 0, signal: 'neutral' as const },
                    { name: 'SMA 20', value: 0, signal: 'neutral' as const },
                    { name: 'EMA 30', value: 0, signal: 'neutral' as const },
                    { name: 'SMA 30', value: 0, signal: 'neutral' as const },
                    { name: 'EMA 50', value: 0, signal: 'neutral' as const },
                    { name: 'SMA 50', value: 0, signal: 'neutral' as const },
                    { name: 'EMA 100', value: 0, signal: 'neutral' as const },
                    { name: 'SMA 100', value: 0, signal: 'neutral' as const }
                  ]} 
                />
              </div>
            </>
          )}

          {fundamentalData && (
            <Card className="w-full bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <CardHeader>
                <CardTitle>Fundamental Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(fundamentalData).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h4>
                      <p className="text-lg font-semibold">{value as string}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;