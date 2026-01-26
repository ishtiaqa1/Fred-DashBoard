import express from 'express';
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const FRED_API_KEY = process.env.FRED_API_KEY;

const getData = async (req,res) => {
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
        const latest = alldata[alldata.length-1];

        res.json({
            latest: latest,
            alldata: alldata
        });
    } catch (error) { 
        console.error(error.code);
    }
}

app.get('/api/series/:seriesID', getData);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`server running on http;//localhost:${PORT}/`);
});
