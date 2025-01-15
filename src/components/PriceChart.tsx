import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  data: {
    labels: string[];
    prices: number[];
  };
}

const PriceChart = ({ data }: PriceChartProps) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Price',
        data: data.prices,
        borderColor: '#0052FF',
        backgroundColor: 'rgba(0, 82, 255, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] bg-background p-4 rounded-lg border">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PriceChart;