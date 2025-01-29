import React from 'react';
import TradingViewChart from '@/components/TradingViewChart';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      <div className="max-w-7xl mx-auto">
        <TradingViewChart symbol="BTCUSDT" />
      </div>
    </div>
  );
};

export default Index;