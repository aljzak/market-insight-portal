import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AnalysisItem {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
}

interface AnalysisTableProps {
  title: string;
  items: AnalysisItem[];
}

const AnalysisTable = ({ title, items }: AnalysisTableProps) => {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-success';
      case 'sell':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">{item.value.toFixed(2)}</TableCell>
              <TableCell className={`text-right ${getSignalColor(item.signal)}`}>
                {item.signal.charAt(0).toUpperCase() + item.signal.slice(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnalysisTable;