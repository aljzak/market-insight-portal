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
  studies_overrides?: object;
  theme?: "Light" | "Dark";
  toolbar_bg?: string;
  loading_screen?: { backgroundColor: string };
  overrides?: {
    [key: string]: string | number | boolean;
  };
}

export declare class widget {
  constructor(options: ChartingLibraryWidgetOptions);
  remove(): void;
}