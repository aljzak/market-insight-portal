declare global {
  interface Window {
    TradingView: {
      widget: new (options: ChartingLibraryWidgetOptions) => {
        remove(): void;
      };
    };
    Datafeeds: {
      UDFCompatibleDatafeed: new (url: string) => any;
    };
  }
}

export interface ChartingLibraryWidgetOptions {
  symbol: string;
  interval: string;
  datafeed: any;
  container: HTMLElement;
  library_path: string;
  locale: string;
  disabled_features?: string[];
  enabled_features?: string[];
  charts_storage_url?: string;
  charts_storage_api_version?: string;
  client_id?: string;
  user_id?: string;
  fullscreen?: boolean;
  autosize?: boolean;
  theme?: "Light" | "Dark";
}