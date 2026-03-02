import express from 'express';
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const FRED_API_KEY = process.env.FRED_API_KEY;
const EXCHANGE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const PORT = process.env.PORT || 3001;

if (!FRED_API_KEY) {
    console.error('ERROR: API key not found in .env file!');
    process.exit(1);
}

const getFredData = async (req, res) => {
    try {
        const {seriesID} = req.params;
        
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
        const latest = alldata[alldata.length - 1];
        
        return res.json({
            latest: latest,
            alldata: alldata
        });
        
    } catch (error) { 
        console.error('Error:', error.message);
        return res.status(500).json({ 
            error: 'Failed to fetch data',
            message: error.message 
        });
    }
}

// const getExchangeData = async (req, res) => {
//     try {
//         const response = await axios.get(
//             `http://api.exchangerate.host/live`,
//             {
//                 params: {
//                     access_key: EXCHANGE_API_KEY,
//                     file_type: 'json'
//                 }
//             }
//         );
        
//         const alldata = response.quotes;
        
//         return res.json({
//             alldata: alldata
//         });
        
//     } catch (error) { 
//         console.error('Error:', error.message);
//         return res.status(500).json({ 
//             error: 'Failed to fetch data',
//             message: error.message 
//         });
//     }
// }

app.get('/api/series/:seriesID', getFredData);
// app.get('/live', getExchangeData);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
