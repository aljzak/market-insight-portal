import React from 'react';
import { Button } from "@/components/ui/button";

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const timeframes = [
  { label: '1D', value: '1d' },
  { label: '4H', value: '4h' },
  { label: '1H', value: '1h' },
  { label: '15M', value: '15m' },
];

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }: TimeframeSelectorProps) => {
  return (
    <div className="flex gap-2">
      {timeframes.map((tf) => (
        <Button
          key={tf.value}
          variant={selectedTimeframe === tf.value ? "default" : "outline"}
          onClick={() => onTimeframeChange(tf.value)}
          className="w-16"
        >
          {tf.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;