import React, { useState, useEffect } from 'react';
import SymbolSearch from '@/components/SymbolSearch';
import TimeframeSelector from '@/components/TimeframeSelector';
import PriceChart from '@/components/PriceChart';
import AnalysisGauge from '@/components/AnalysisGauge';
import AnalysisTable from '@/components/AnalysisTable';
import { useToast } from "@/components/ui/use-toast";
import { getFundamentalAnalysis } from '@/services/gemini';

// Mock data - replace with actual API calls
const mockChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  prices: [30000, 32000, 31000, 33000, 32500, 34000],
};

const mockIndicators = [
  { name: 'RSI', value: 65.5, signal: 'buy' as const },
  { name: 'MACD', value: 245.3, signal: 'buy' as const },
  { name: 'MA Cross', value: 0, signal: 'neutral' as const },
  { name: 'Stochastic', value: 80.2, signal: 'sell' as const },
  { name: 'ADX', value: 32.1, signal: 'buy' as const },
  { name: 'ATR', value: 1250.4, signal: 'neutral' as const },
];

const mockMovingAverages = [
  { name: 'SMA 10', value: 32150.5, signal: 'buy' as const },
  { name: 'EMA 20', value: 31980.3, signal: 'buy' as const },
  { name: 'SMA 30', value: 31750.0, signal: 'neutral' as const },
  { name: 'EMA 50', value: 31500.2, signal: 'sell' as const },
  { name: 'SMA 100', value: 31200.1, signal: 'sell' as const },
  { name: 'EMA 200', value: 30950.4, signal: 'neutral' as const },
];

const Index = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1d');
  const [fundamentalData, setFundamentalData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFundamentalData = async () => {
      const data = await getFundamentalAnalysis(symbol);
      if (data) {
        setFundamentalData(data);
      }
    };

    fetchFundamentalData();
  }, [symbol]);

  const handleSearch = (newSymbol: string) => {
    setSymbol(newSymbol);
    toast({
      title: "Symbol Updated",
      description: `Now showing data for ${newSymbol}`,
    });
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    toast({
      title: "Timeframe Updated",
      description: `Switched to ${newTimeframe.toUpperCase()} timeframe`,
    });
  };

  // Calculate summary metrics
  const calculateSummary = (indicators: typeof mockIndicators) => {
    const buys = indicators.filter(i => i.signal === 'buy').length;
    const sells = indicators.filter(i => i.signal === 'sell').length;
    const neutrals = indicators.filter(i => i.signal === 'neutral').length;
    
    let signal: 'Strong Sell' | 'Sell' | 'Neutral' | 'Buy' | 'Strong Buy' = 'Neutral';
    if (buys > sells + neutrals) signal = 'Strong Buy';
    else if (buys > sells) signal = 'Buy';
    else if (sells > buys + neutrals) signal = 'Strong Sell';
    else if (sells > buys) signal = 'Sell';

    return { buys, sells, neutrals, signal };
  };

  const oscillatorsSummary = calculateSummary(mockIndicators);
  const masSummary = calculateSummary(mockMovingAverages);

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

          <PriceChart data={mockChartData} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalysisGauge
              title="Oscillators"
              value={oscillatorsSummary.buys}
              total={mockIndicators.length}
              buys={oscillatorsSummary.buys}
              sells={oscillatorsSummary.sells}
              neutrals={oscillatorsSummary.neutrals}
              signal={oscillatorsSummary.signal}
            />
            <AnalysisGauge
              title="Moving Averages"
              value={masSummary.buys}
              total={mockMovingAverages.length}
              buys={masSummary.buys}
              sells={masSummary.sells}
              neutrals={masSummary.neutrals}
              signal={masSummary.signal}
            />
            <AnalysisGauge
              title="Summary"
              value={(oscillatorsSummary.buys + masSummary.buys)}
              total={mockIndicators.length + mockMovingAverages.length}
              buys={oscillatorsSummary.buys + masSummary.buys}
              sells={oscillatorsSummary.sells + masSummary.sells}
              neutrals={oscillatorsSummary.neutrals + masSummary.neutrals}
              signal={oscillatorsSummary.signal}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalysisTable title="Oscillators" items={mockIndicators} />
            <AnalysisTable title="Moving Averages" items={mockMovingAverages} />
          </div>

          {fundamentalData && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Fundamental Analysis</h3>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(fundamentalData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;