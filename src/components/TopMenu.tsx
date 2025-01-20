import { Menu, DollarSign } from "lucide-react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

interface TopMenuProps {
  symbol: string;
  price?: number;
}

const TopMenu = ({ symbol, price }: TopMenuProps) => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-[#1A1F2C] border-b border-[#8E9196]/20">
      <div className="flex items-center gap-4">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        </div>
        <Menubar className="border-none bg-transparent">
          <MenubarMenu>
            <MenubarTrigger className="text-white hover:text-[#9b87f5]">
              <Menu className="h-5 w-5" />
            </MenubarTrigger>
            <MenubarContent className="bg-[#1A1F2C] border-[#8E9196]/20">
              <MenubarItem className="text-white hover:text-[#9b87f5]">Dashboard</MenubarItem>
              <MenubarItem className="text-white hover:text-[#9b87f5]">Analysis</MenubarItem>
              <MenubarItem className="text-white hover:text-[#9b87f5]">Settings</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      {price && (
        <div className="flex items-center gap-2 text-white">
          <DollarSign className="h-4 w-4 text-[#9b87f5]" />
          <span>{price.toFixed(2)}</span>
          <span className="text-[#8E9196]">{symbol}</span>
        </div>
      )}
    </div>
  );
};

export default TopMenu;