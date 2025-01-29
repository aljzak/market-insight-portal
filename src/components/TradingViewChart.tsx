import React, { useEffect, useRef } from 'react';
import { widget } from '@/charting_library/charting_library';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
}

const TradingViewChart = ({ symbol, interval = 'D' }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing TradingView chart with:', { symbol, interval });

    const widgetOptions = {
      symbol: symbol,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
      interval: interval,
      container: containerRef.current,
      library_path: '/charting_library/',
      locale: 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      theme: 'Dark' as const,
    };

    try {
      const tvWidget = new widget(widgetOptions);
      console.log('TradingView widget initialized successfully');

      return () => {
        console.log('Cleaning up TradingView widget');
        tvWidget.remove();
      };
    } catch (error) {
      console.error('Error initializing TradingView widget:', error);
    }
  }, [symbol, interval]);

  return (
    <div className="w-full h-[600px] relative">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};

export default TradingViewChart;