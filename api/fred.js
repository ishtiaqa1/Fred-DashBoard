import express from 'express';
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const FRED_API_KEY = process.env.FRED_API_KEY;
const PORT = 3001;

if (!FRED_API_KEY) {
    console.error('ERROR: FRED_API_KEY not found in .env file!');
    process.exit(1);
}

const getData = async (req, res) => {
    try {
        const {seriesID} = req.params;
        console.log(`Fetching series: ${seriesID}`);
        
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

app.get('/api/series/:seriesID', getData);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
