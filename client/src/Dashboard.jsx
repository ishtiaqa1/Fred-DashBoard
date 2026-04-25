import React, { useState, useEffect, useCallback } from 'react'
import IndicatorCard from './IndicatorCard.jsx';
import Selector from './Selector.jsx';
import Chart from './Chart.jsx';
import Exchange from './Exchange.jsx';
import Crypto from './Crypto.jsx';
import Commodities from './Commodities.jsx';
import Footer from './Footer.jsx';
import './Dashboard.css'

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 800;
const API_URL = import.meta.env.VITE_API_URL;

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const text = await response.text();
      if (!text || text.trim() === '') throw new Error(`Empty response from ${url}`);
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON from ${url}`);
      }
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
    }
  }
}

function formatGDP(value) {
  if (!value) return 'N/A';
  const billions = parseFloat(value);
  if (billions >= 1000) {
    return '$' + (billions / 1000).toFixed(2) + 'T';
  }
  return '$' + billions.toFixed(0) + 'B';
}

function computeInflationYoY(inflationData) {
  if (!inflationData?.alldata || inflationData.alldata.length < 13) return null;
  const all = inflationData.alldata;
  const latest = all[all.length - 1];
  const yearAgo = all[all.length - 13];
  if (!latest || !yearAgo) return null;
  const pct = ((parseFloat(latest.value) - parseFloat(yearAgo.value)) / parseFloat(yearAgo.value)) * 100;
  return { value: pct.toFixed(2), date: latest.date };
}

function Dashboard() {
  const [data, setData] = useState({
    gdp: null,
    unemployment: null,
    inflation: null,
    interestRate: null,
  });
  const [loading, setLoading] = useState(true);
  const [selector, setSelector] = useState('gdp');
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchWithRetry(`${API_URL}/api/series/GDP`),
      fetchWithRetry(`${API_URL}/api/series/UNRATE`),
      fetchWithRetry(`${API_URL}/api/series/CPIAUCSL`),
      fetchWithRetry(`${API_URL}/api/series/DFF`),
    ])
    .then(([gdp, unemployment, inflation, interestRate]) => {
      setData({ gdp, unemployment, inflation, interestRate });
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div className="loading-state">FETCHING LIVE DATA</div>;

  if (error) return (
    <div className="error-state">
      <div className="error-message">
        <span className="error-label">ERROR</span>
        <span className="error-text">{error}</span>
        <button className="retry-btn" onClick={fetchData}>↺ RETRY</button>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <h1 className="dashboard-title">US Economic Dashboard</h1>
        <p className="dashboard-subtitle">FRED / Federal Reserve Economic Data · Live</p>
      </div>

      {/* Macro indicators */}
      <section id="cards">
        <IndicatorCard
          title="Gross Domestic Product"
          value={formatGDP(data.gdp?.latest?.value)}
          date={data.gdp?.latest?.date}
          note="Billions USD (FRED)"
        />
        <IndicatorCard
          title="Unemployment"
          value={data.unemployment?.latest?.value + '%'}
          date={data.unemployment?.latest?.date}
        />
        <IndicatorCard
          title="Inflation (YoY)"
          value={computeInflationYoY(data.inflation) ? computeInflationYoY(data.inflation).value + '%' : 'N/A'}
          date={computeInflationYoY(data.inflation)?.date}
          note="CPI YoY % change (CPIAUCSL)"
        />
        <IndicatorCard
          title="Interest Rate"
          value={data.interestRate?.latest?.value + '%'}
          date={data.interestRate?.latest?.date}
        />
      </section>

      {/* Historical chart */}
      <section id="selector">
        <Selector selector={selector} setSelector={setSelector} />
      </section>
      <section>
        <Chart value={data[selector]} selector={selector.toString().toUpperCase()} />
      </section>

      {/* Exchange rates */}
      <section>
        <Exchange />
      </section>

      {/* Commodities */}
      <section>
        <Commodities />
      </section>

      {/* Crypto */}
      <section>
        <Crypto />
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
}

export default Dashboard;