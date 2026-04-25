import React, { useState, useEffect } from 'react'
import './Crypto.css'

const API_URL = import.meta.env.VITE_API_URL;

const CRYPTO_META = {
  bitcoin:      { symbol: 'BTC', name: 'Bitcoin',  icon: '₿' },
  ethereum:     { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  solana:       { symbol: 'SOL', name: 'Solana',   icon: '◎' },
  binancecoin:  { symbol: 'BNB', name: 'BNB',      icon: 'B' },
  ripple:       { symbol: 'XRP', name: 'XRP',      icon: 'X' },
  cardano:      { symbol: 'ADA', name: 'Cardano',  icon: 'A' },
};

function formatPrice(n) {
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1)    return '$' + n.toFixed(2);
  return '$' + n.toFixed(4);
}

function formatMcap(n) {
  if (!n) return '—';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return '$' + (n / 1e9).toFixed(1) + 'B';
  return '$' + (n / 1e6).toFixed(0) + 'M';
}

function Crypto() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/crypto`)
      .then(r => {
        if (r.status === 503) throw new Error('Temporarily unavailable — CoinGecko rate limit. Try again shortly.');
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">CRYPTO</span>
        <span className="panel-sub">USD prices · CoinGecko</span>
      </div>

      {loading && <div className="panel-loading">FETCHING CRYPTO…</div>}
      {error   && <div className="panel-error">⚠ {error}</div>}

      {data && (
        <div className="crypto-grid">
          {Object.entries(CRYPTO_META).map(([id, meta]) => {
            const coin = data[id];
            if (!coin) return null;
            const change = coin.usd_24h_change;
            const isUp = change >= 0;
            return (
              <div key={id} className="crypto-card">
                <div className="crypto-icon">{meta.icon}</div>
                <div className="crypto-body">
                  <div className="crypto-top">
                    <span className="crypto-symbol">{meta.symbol}</span>
                    <span className={`crypto-change ${isUp ? 'up' : 'down'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                    </span>
                  </div>
                  <span className="crypto-price">{formatPrice(coin.usd)}</span>
                  <span className="crypto-mcap">MCap {formatMcap(coin.usd_market_cap)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Crypto;