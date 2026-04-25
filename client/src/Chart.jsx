import React from 'react'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2';

function Chart(props) {
  if (!props.value || !props.value.alldata) {
    return <div id="chart" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '3rem', textAlign: 'center' }}>NO DATA AVAILABLE</div>;
  }

  const label = props.value.alldata.map((v) => v.date);
  const values = props.value.alldata.map((v) => v.value);

  const chartData = {
    labels: label,
    datasets: [{
      label: props.selector,
      data: values,
      borderColor: '#00d4aa',
      borderWidth: 2,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return 'transparent';
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(0, 212, 170, 0.18)');
        gradient.addColorStop(1, 'rgba(0, 212, 170, 0.01)');
        return gradient;
      },
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#00d4aa',
      pointHoverBorderColor: '#0a0e13',
      pointHoverBorderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: {
          color: '#7a93ae',
          font: { family: 'Space Mono', size: 11 },
          boxWidth: 12,
          boxHeight: 2,
          usePointStyle: false,
        }
      },
      tooltip: {
        backgroundColor: '#141c26',
        borderColor: '#2a4060',
        borderWidth: 1,
        titleColor: '#7a93ae',
        bodyColor: '#00d4aa',
        titleFont: { family: 'Space Mono', size: 10 },
        bodyFont: { family: 'Space Mono', size: 13, weight: 'bold' },
        padding: 12,
        displayColors: false,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#3d5470',
          font: { family: 'Space Mono', size: 10 },
          maxTicksLimit: 10,
          maxRotation: 0,
        },
        grid: { color: 'rgba(30, 45, 64, 0.6)' },
        border: { color: '#1e2d40' },
      },
      y: {
        ticks: {
          color: '#3d5470',
          font: { family: 'Space Mono', size: 10 },
          maxTicksLimit: 7,
        },
        grid: { color: 'rgba(30, 45, 64, 0.6)' },
        border: { color: '#1e2d40' },
      }
    }
  };

  return (
    <div id="chart">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default Chart;