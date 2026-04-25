import React, { useState, useEffect } from 'react'
import './Commodities.css'

const API_URL = import.meta.env.VITE_API_URL;

// Metals from gold-api.com (free, no key, no rate limit)
const METALS = [
  { symbol: 'XAU', label: 'Gold',     unit: 'USD/troy oz', icon: '🥇', decimals: 2 },
  { symbol: 'XAG', label: 'Silver',   unit: 'USD/troy oz', icon: '🥈', decimals: 2 },
  { symbol: 'XPT', label: 'Platinum', unit: 'USD/troy oz', icon: '⚪', decimals: 2 },
  { symbol: 'HG',  label: 'Copper',   unit: 'USD/lb',      icon: '🔶', decimals: 3 },
];

// Energy/Agri still from FRED (these series are active)
const FRED_COMMODITIES = [
  { id: 'DCOILWTICO',  label: 'Crude Oil', unit: 'USD/barrel', icon: '🛢',  decimals: 2 },
  { id: 'PWHEAMTUSDM', label: 'Wheat',     unit: 'USD/mt',     icon: '🌾', decimals: 2 },
];

function Commodities() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const metalFetches = METALS.map(m =>
      fetch(`https://api.gold-api.com/price/${m.symbol}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => ({ ...m, price: data.price, date: null }))
        .catch(() => ({ ...m, price: null, date: null }))
    );

    const fredFetches = FRED_COMMODITIES.map(c =>
      fetch(`${API_URL}/api/series/${c.id}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => ({ ...c, price: data.latest?.value ? Number(data.latest.value) : null, date: data.latest?.date }))
        .catch(() => ({ ...c, price: null, date: null }))
    );

    Promise.allSettled([...metalFetches, ...fredFetches]).then(results => {
      setItems(results.map(r => r.value));
      setLoading(false);
    });
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">COMMODITIES</span>
        <span className="panel-sub">Metals: gold-api.com · Energy/Agri: FRED</span>
      </div>

      {loading && <div className="panel-loading">FETCHING COMMODITIES…</div>}

      {!loading && (
        <div className="commodity-grid">
          {items.map((item, i) => (
            <div key={i} className="commodity-card">
              <span className="commodity-icon">{item.icon}</span>
              <div className="commodity-body">
                <span className="commodity-label">{item.label}</span>
                <span className="commodity-price">
                  {item.price != null ? '$' + Number(item.price).toFixed(item.decimals) : '—'}
                </span>
                <span className="commodity-meta">
                  {item.unit}{item.date ? ' · ' + item.date : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Commodities;