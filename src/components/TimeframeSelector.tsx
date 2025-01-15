import React from 'react';
import { Button } from "@/components/ui/button";

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const timeframes = [
  { label: '1M', value: '1m' },
  { label: '5M', value: '5m' },
  { label: '15M', value: '15m' },
  { label: '30M', value: '30m' },
  { label: '1H', value: '1h' },
  { label: '2H', value: '2h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
];

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }: TimeframeSelectorProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {timeframes.map((tf) => (
        <Button
          key={tf.value}
          variant={selectedTimeframe === tf.value ? "default" : "outline"}
          onClick={() => onTimeframeChange(tf.value)}
          className="min-w-[60px]"
        >
          {tf.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;