import { Copyright } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full px-6 py-4 bg-[#1A1F2C] border-t border-[#8E9196]/20">
      <div className="flex items-center justify-center gap-2 text-[#8E9196]">
        <Copyright className="h-4 w-4" />
        <span>{new Date().getFullYear()} Market Insight Portal</span>
      </div>
    </footer>
  );
};

export default Footer;