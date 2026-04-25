import React, { useState, useEffect } from 'react'
import './Exchange.css'

const API_URL = import.meta.env.VITE_API_URL;

const CURRENCY_META = {
  EUR: { name: 'Euro',           flag: '🇪🇺' },
  GBP: { name: 'Brit. Pound',   flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen',  flag: '🇯🇵' },
  CAD: { name: 'Canadian $',    flag: '🇨🇦' },
  CHF: { name: 'Swiss Franc',   flag: '🇨🇭' },
  AUD: { name: 'Australian $',  flag: '🇦🇺' },
  CNY: { name: 'Chinese Yuan',  flag: '🇨🇳' },
  MXN: { name: 'Mexican Peso',  flag: '🇲🇽' },
  INR: { name: 'Indian Rupee',  flag: '🇮🇳' },
  BRL: { name: 'Brazilian Real',flag: '🇧🇷' },
};

function Exchange() {
  const [rates, setRates]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [updated, setUpdated] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/exchange`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setRates(data.rates);
        setUpdated(data.date);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">FX RATES</span>
        <span className="panel-sub">USD → {loading ? '…' : updated}</span>
      </div>

      {loading && <div className="panel-loading">FETCHING RATES…</div>}
      {error   && <div className="panel-error">⚠ {error}</div>}

      {rates && (
        <div className="fx-grid">
          {Object.entries(rates).map(([code, rate]) => {
            const meta = CURRENCY_META[code] || { name: code, flag: '💱' };
            return (
              <div key={code} className="fx-card">
                <span className="fx-flag">{meta.flag}</span>
                <div className="fx-info">
                  <span className="fx-code">{code}</span>
                  <span className="fx-name">{meta.name}</span>
                </div>
                <span className="fx-rate">
                  {rate < 1 ? rate.toFixed(4) : rate.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Exchange;