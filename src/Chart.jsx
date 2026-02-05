import React from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2';
 
function Chart(selector, value) {
  return (
    <div id='chart'>
        <Line 
            data = {{
                labels: value[date],
                datasets: {
                    label: selector,
                    data: value[value]
                }
            }}
        />
    </div>
  )
}

export default Chart