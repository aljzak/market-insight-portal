import TradingViewChart from './components/TradingViewChart';

const App = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold mb-4">TradingView Chart</h1>
      <TradingViewChart symbol="NASDAQ:AAPL" />
    </div>
  );
};

export default App;