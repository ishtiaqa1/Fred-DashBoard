import React, { useState, useEffect, useCallback } from 'react'
import IndicatorCard from './IndicatorCard.jsx';
import Selector from './Selector.jsx';
import Chart from './Chart.jsx';
import './Dashboard.css'
import Exchange from './Exchange.jsx';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 800;
const API_URL = import.meta.env.VITE_API_URL;

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const text = await response.text();
      if (!text || text.trim() === '') {
        throw new Error(`Empty response from ${url}`);
      }
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON from ${url}`);
      }
    } catch (err) {
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) {
        throw err;
      }
      console.warn(`Attempt ${attempt} failed for ${url}: ${err.message}. Retrying in ${RETRY_DELAY_MS * attempt}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
    }
  }
}

function Dashboard() {
  const [data, setData] = useState({
    gdp: null,
    unemployment: null,
    inflation: null,
    interestRate: null
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
      fetchWithRetry(`${API_URL}/api/series/FPCPITOTLZGUSA`),
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      <section id="cards">
        <IndicatorCard
          title="Gross Domestic Product"
          value={'$' + data.gdp?.latest?.value}
          date={data.gdp?.latest?.date}
        />
        <IndicatorCard
          title="Unemployment"
          value={data.unemployment?.latest?.value + '%'}
          date={data.unemployment?.latest?.date}
        />
        <IndicatorCard
          title="Inflation"
          value={Number(data.inflation?.latest?.value).toFixed(2) + '%'}
          date={data.inflation?.latest?.date}
        />
        <IndicatorCard
          title="Interest Rate"
          value={data.interestRate?.latest?.value + '%'}
          date={data.interestRate?.latest?.date}
        />
      </section>
      <section id="selector">
        <Selector selector={selector} setSelector={setSelector} />
      </section>
      <section>
        <Chart value={data[selector]} selector={selector.toString().toUpperCase()} />
      </section>
      <section>
        <Exchange />
      </section>
    </>
  );
}

export default Dashboard;