import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  });

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5001/api/trades', {
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
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Congress Trades</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBotton: '50px' }}>
        <label htmlFor='start-date' style={{ marginBottom: '5px' }}>Start Date</label>
        <input 
          id='start-date'
          type='date' 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          style={{ width: '200px' }}
        />
        <label htmlFor='end-date' style={{ marginBottom: '5px', marginTop: '10px' }}>End Date</label>
        <input 
          id='end-date'
          type='date' 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          style={{ width: '200px' }}
        />
        <button
          onClick={fetchTrades}
          style={{ width: '200px', marginTop: '10px' }}
          disabled={loading}
        >
          Analyze
        </button>
        
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '0.1fr 0.1fr 0.1fr 0.15fr 0.2fr', columnGap: '50px', rowGap: '0px' }}>
        <div><strong>Date</strong></div>
        <div><strong>Ticker</strong></div>
        <div><strong>Transaction</strong></div>
        <div style={{ textAlign: 'right' }}><strong>Total Volume Traded</strong></div>
        <div><strong>Largest Trader</strong></div>
        {
          loading ? <div>Analyzing historical trades...</div> :
          error ? <div>Error fetching trades: {error.message}</div> :
          <>
            {trades.purchase_summary && trades.purchase_summary.map((trade, index) => (
              <>
                <div key={`purchase-${index}`} style={{ textAlign: 'left' }}>{trade.Trade_Date ? new Date(trade.Trade_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date'}</div>
                <div>{trade.Ticker}</div>
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
          </>
        }
      </div>
    </div>
  );
};

export default Trades;
