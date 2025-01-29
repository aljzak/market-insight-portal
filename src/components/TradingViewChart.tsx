import React, { useEffect, useRef } from 'react';
import { widget } from '@/charting_library/charting_library';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
}

declare global {
  interface Window {
    TradingView: any;
    Datafeeds: {
      UDFCompatibleDatafeed: new (url: string) => any;
    };
  }
}

const TradingViewChart = ({ symbol, interval = 'D' }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Initializing TradingView chart with:', { symbol, interval });

    const widgetOptions = {
      symbol: symbol,
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
      interval: interval,
      container: containerRef.current,
      library_path: '/charting_library/',
      locale: 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: [
        'study_templates',
        'drawing_templates',
        'multiple_charts_layout',
        'symbol_search_hot_key'
      ],
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      theme: 'Dark' as const,
      toolbar_bg: '#1A1F2C',
      loading_screen: { backgroundColor: "#1A1F2C" },
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#00C805",
        "mainSeriesProperties.candleStyle.downColor": "#FF1744",
        "mainSeriesProperties.candleStyle.borderUpColor": "#00C805",
        "mainSeriesProperties.candleStyle.borderDownColor": "#FF1744",
        "mainSeriesProperties.candleStyle.wickUpColor": "#00C805",
        "mainSeriesProperties.candleStyle.wickDownColor": "#FF1744",
      }
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