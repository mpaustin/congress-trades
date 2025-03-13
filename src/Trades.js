import React, { useEffect, useState } from "react";
import axios from "axios";

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-03-01");

  const fetchTrades = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/trades", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      setTrades(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [startDate, endDate]);

  if (loading) return <div>Analyzing historical trades...</div>;
  if (error) return <div>Error fetching trades: {error.message}</div>;

  return (
    <div>
      <h1>Congress Trades</h1>
      <div>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
        <button onClick={fetchTrades}>Analyze</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '10px' }}>
        <div><strong>Date</strong></div>
        <div><strong>Ticker</strong></div>
        <div><strong>Transaction</strong></div>
        <div><strong>Amount</strong></div>
        <div><strong>Representative</strong></div>
        {trades.purchase_summary && trades.purchase_summary.map((trade, index) => (
          <>
            <div key={`purchase-${index}`} style={{ textAlign: 'left' }}>{trade.Trade_Date ? new Date(trade.Trade_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date'}</div>
            <div style={{ textAlign: 'left' }}>{trade.Ticker}</div>
            <div style={{ textAlign: 'left' }}>Purchase</div>
            <div style={{ textAlign: 'right' }}>${trade.Total_Amount ? parseFloat(trade.Total_Amount).toFixed(2).toLocaleString() : 'N/A'}</div>
            <div style={{ textAlign: 'left' }}>{trade.Top_Trader}</div>
          </>
        ))}
        {trades.sales_summary && trades.sales_summary.map((trade, index) => (
          <>
            <div key={`sale-${index}`} style={{ textAlign: 'left' }}>{trade.Trade_Date ? new Date(trade.Trade_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date'}</div>
            <div style={{ textAlign: 'left' }}>{trade.Ticker}</div>
            <div style={{ textAlign: 'left' }}>Sale</div>
            <div style={{ textAlign: 'right' }}>${trade.Total_Amount ? parseFloat(trade.Total_Amount).toFixed(2).toLocaleString() : 'N/A'}</div>
            <div style={{ textAlign: 'left' }}>{trade.Top_Trader}</div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Trades;
