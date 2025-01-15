import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from "lucide-react";

interface Indicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
}

interface TechnicalIndicatorsProps {
  indicators: Indicator[];
}

const TechnicalIndicators = ({ indicators }: TechnicalIndicatorsProps) => {
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <ArrowUpCircle className="h-5 w-5 text-success" />;
      case 'sell':
        return <ArrowDownCircle className="h-5 w-5 text-destructive" />;
      default:
        return <MinusCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicators.map((indicator) => (
            <div
              key={indicator.name}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div>
                <p className="font-medium">{indicator.name}</p>
                <p className="text-sm text-muted-foreground">{indicator.value}</p>
              </div>
              {getSignalIcon(indicator.signal)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;