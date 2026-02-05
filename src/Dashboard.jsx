import React, { useState, useEffect } from 'react'
import IndicatorCard from './IndicatorCard';
import Selector from './Selector';
import Chart from './Chart';
import './Dashboard.css'

function Dashboard() {
  const [data, setData] = useState({
    gdp: null,
    unemployment: null,
    inflation: null,
    interestRate: null
  });
  const [loading, setLoading] = useState(true);
  const [selector, setSelector] = useState('gdp');

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/api/series/GDP').then(r => r.json()),
      fetch('http://localhost:3001/api/series/UNRATE').then(r => r.json()),
      fetch('http://localhost:3001/api/series/FPCPITOTLZGUSA').then(r => r.json()),
      fetch('http://localhost:3001/api/series/DFF').then(r => r.json())
    ])
    .then(([gdp, unemployment, inflation, interestRate]) => {
      setData({
        gdp: gdp,
        unemployment: unemployment,
        inflation: inflation,
        interestRate: interestRate
      });
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <h1>US Economic Dashboard</h1>
      <section id='cards'>
        <IndicatorCard title="Gross Domestic Product" value={'$'+data.gdp?.latest?.value} date={data.gdp?.latest?.date} />
        <IndicatorCard title="Unemployment" value={data.unemployment?.latest?.value+'%'} date={data.unemployment?.latest?.date} />
        <IndicatorCard title="Inflation" value={Number(data.inflation?.latest?.value).toFixed(2)+'%'} date={data.inflation?.latest?.date} />
        <IndicatorCard title="Interest Rate" value={data.interestRate?.latest?.value+'%'} date={data.interestRate?.latest?.date} />
      </section>
      <section id='selector'>
        <Selector selector={selector} setSelector={setSelector}/>
      </section>
      <section>
        <Chart topic={selector} value={data[selector].alldata} />
      </section>
    </>
  )
}

export default Dashboard