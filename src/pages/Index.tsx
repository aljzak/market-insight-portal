import React, { useState } from 'react';
import SymbolSearch from '@/components/SymbolSearch';
import TimeframeSelector from '@/components/TimeframeSelector';
import PriceChart from '@/components/PriceChart';
import TechnicalIndicators from '@/components/TechnicalIndicators';
import { useToast } from "@/components/ui/use-toast";

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

const Index = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1d');
  const { toast } = useToast();

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
          
          <TechnicalIndicators indicators={mockIndicators} />
        </div>
      </div>
    </div>
  );
};

export default Index;