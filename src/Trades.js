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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 5fr', columnGap: '20px', rowGap: '10px', marginTop: '20px' }}>
        <div style={{ fontWeight: 'bold' }}>Date</div>
        <div style={{ fontWeight: 'bold' }}>Ticker</div>
        <div style={{ fontWeight: 'bold' }}>Transaction</div>
        <div style={{ fontWeight: 'bold', textAlign: 'right', marginRight: '5em' }}>Total Volume Traded</div>
        <div style={{ fontWeight: 'bold' }}>Largest Trader</div>
        {
          loading ? <div style={{ gridColumn: 'span 5', textAlign: 'center' }}>Analyzing historical trades...</div> :
          error ? <div style={{ gridColumn: 'span 5', textAlign: 'center' }}>Error fetching trades: {error.message}</div> :
          <>
            {trades.purchase_summary && trades.purchase_summary.map((trade, index) => (
              <>
                <div key={`purchase-${index}`}>{trade.Trade_Date ? new Date(trade.Trade_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date'}</div>
                <div>{trade.Ticker}</div>
                <div>Purchase</div>
                <div style={{ textAlign: 'right', marginRight: '5em' }}>${trade.Total_Amount ? parseFloat(trade.Total_Amount).toFixed(2).toLocaleString() : 'N/A'}</div>
                <div>{trade.Top_Trader}</div>
              </>
            ))}
            {trades.sales_summary && trades.sales_summary.map((trade, index) => (
              <>
                <div key={`sale-${index}`}>{trade.Trade_Date ? new Date(trade.Trade_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date'}</div>
                <div>{trade.Ticker}</div>
                <div>Sale</div>
                <div style={{ textAlign: 'right', marginRight: '5em' }}>${trade.Total_Amount ? parseFloat(trade.Total_Amount).toFixed(2).toLocaleString() : 'N/A'}</div>
                <div>{trade.Top_Trader}</div>
              </>
            ))}
          </>
        }
      </div>
    </div>
  );
};

export default Trades;
