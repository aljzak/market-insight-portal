import * as React from 'react';
import type { ChartingLibraryWidgetOptions } from '@/types/tradingview';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
}

const TradingViewChart = ({ symbol, interval = 'D' }: TradingViewChartProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const initChart = () => {
      console.log('Initializing TradingView chart with:', { symbol, interval });

      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: symbol,
        datafeed: new window.Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
        interval: interval,
        container: containerRef.current,
        library_path: '/charting_library/',
        locale: 'en',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'depin-crypto.info',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        theme: "Dark" as const,
      };

      try {
        const tvWidget = new window.TradingView.widget(widgetOptions);
        console.log('TradingView widget initialized successfully');

        return () => {
          console.log('Cleaning up TradingView widget');
          tvWidget.remove();
        };
      } catch (error) {
        console.error('Error initializing TradingView widget:', error);
      }
    };

    // Wait for TradingView library to be loaded
    if (window.TradingView && window.Datafeeds) {
      initChart();
    } else {
      const interval = setInterval(() => {
        if (window.TradingView && window.Datafeeds) {
          clearInterval(interval);
          initChart();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [symbol, interval]);

  return (
    <div className="w-full h-[600px] relative">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};

export default TradingViewChart;