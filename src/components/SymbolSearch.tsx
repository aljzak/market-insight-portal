import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SymbolSearchProps {
  onSearch: (symbol: string) => void;
}

const SymbolSearch = ({ onSearch }: SymbolSearchProps) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter symbol (e.g., BTCUSDT)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full md:w-[300px]"
      />
      <Button type="submit" variant="default">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SymbolSearch;