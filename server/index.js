import express from 'express';
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://freddashboard.vercel.app'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const FRED_API_KEY = process.env.FRED_API_KEY;
const PORT = process.env.PORT || 3001;

if (!FRED_API_KEY) {
    console.error('ERROR: FRED API key not found in .env file!');
    process.exit(1);
}

// ── FRED series (GDP, unemployment, inflation, interest rate, commodities) ──
const getFredData = async (req, res) => {
    try {
        const { seriesID } = req.params;
        const response = await axios.get(
            `https://api.stlouisfed.org/fred/series/observations`,
            {
                params: {
                    series_id: seriesID,
                    api_key: FRED_API_KEY,
                    file_type: 'json'
                }
            }
        );
        const alldata = response.data.observations;
        const filtered = alldata.filter(d => d.value !== '.');
        const latest = filtered[filtered.length - 1];
        return res.json({ latest, alldata: filtered });
    } catch (error) {
        console.error('FRED Error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch FRED data', message: error.message });
    }
};

// ── Exchange rates (Frankfurter — free, no API key) ──
const getExchangeRates = async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.frankfurter.app/latest',
            { params: { from: 'USD', to: 'EUR,GBP,JPY,CAD,CHF,AUD,CNY,MXN,INR,BRL' } }
        );
        return res.json(response.data);
    } catch (error) {
        console.error('Exchange Error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch exchange rates', message: error.message });
    }
};

// ── Crypto prices (CoinGecko public API) ──
const getCrypto = async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price',
            {
                params: {
                    ids: 'bitcoin,ethereum,solana,binancecoin,ripple,cardano',
                    vs_currencies: 'usd',
                    include_24hr_change: 'true',
                    include_market_cap: 'true'
                },
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; FredDashboard/1.0)'
                },
                timeout: 10000
            }
        );
        return res.json(response.data);
    } catch (error) {
        console.error('Crypto Error:', error.response?.status, error.message);
        // 503 so the client can distinguish "down" from a real server error
        return res.status(503).json({ error: 'Crypto data temporarily unavailable', message: error.message });
    }
};

app.get('/api/series/:seriesID', getFredData);
app.get('/api/exchange', getExchangeRates);
app.get('/api/crypto', getCrypto);

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}/`);
    });
}

export default app;