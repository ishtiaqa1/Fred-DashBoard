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
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/api/series/GDP').then(r => {
        if (!r.ok) throw new Error('GDP fetch failed');
        return r.json();
      }),
      fetch('http://localhost:3001/api/series/UNRATE').then(r => {
        if (!r.ok) throw new Error('UNRATE fetch failed');
        return r.json();
      }),
      fetch('http://localhost:3001/api/series/FPCPITOTLZGUSA').then(r => {
        if (!r.ok) throw new Error('Inflation fetch failed');
        return r.json();
      }),
      fetch('http://localhost:3001/api/series/DFF').then(r => {
        if (!r.ok) throw new Error('Interest rate fetch failed');
        return r.json();
      })
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
      setError(error.message)
      setLoading(false);
    });
  }, []);
  // console.log(data.interestRate, 'interest rate');
  // console.log(data.gdp, 'gdp')
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>
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
        <Chart value={data[selector]} selector={selector.toString().toUpperCase()} /> 
      </section>
    </>
  )
}

export default Dashboard