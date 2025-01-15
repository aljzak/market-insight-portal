import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GaugeProps {
  title: string;
  value: number;
  total: number;
  buys: number;
  sells: number;
  neutrals: number;
  signal: 'Strong Sell' | 'Sell' | 'Neutral' | 'Buy' | 'Strong Buy';
}

const AnalysisGauge = ({ title, value, total, buys, sells, neutrals, signal }: GaugeProps) => {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Strong Buy':
      case 'Buy':
        return 'text-success';
      case 'Strong Sell':
      case 'Sell':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const percentage = (value / total) * 100;
  const rotation = (percentage / 100) * 180 - 90; // -90 to start at the left

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-8 border-muted" />
              <div
                className="absolute w-2 h-12 bg-primary origin-bottom"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'bottom center',
                  bottom: '50%',
                  left: 'calc(50% - 4px)',
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getSignalColor(signal)}`}>
                {signal}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Sells</p>
              <p className="text-lg font-semibold text-destructive">{sells}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Neutral</p>
              <p className="text-lg font-semibold">{neutrals}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Buys</p>
              <p className="text-lg font-semibold text-success">{buys}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisGauge;