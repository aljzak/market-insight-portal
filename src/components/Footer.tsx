import { Copyright } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full px-6 py-4 bg-[#1A1F2C] border-t border-[#8E9196]/20">
      <div className="flex flex-col items-center justify-center gap-2 text-[#8E9196]">
        <div className="flex items-center gap-2">
          <Copyright className="h-4 w-4" />
          <span>{new Date().getFullYear()} Market Insight Portal</span>
        </div>
        <div>
          <a 
            href="https://www.tradingview.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-white transition-colors"
          >
            Powered by TradingView
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;