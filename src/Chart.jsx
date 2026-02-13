import React from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2';
 
function Chart(props) {
    if (!props.value || !props.value.alldata) {
        return <div>No data available</div>;
    }
    const label = props.value.alldata.map((v) => v.date);
    const values = props.value.alldata.map((v) => v.value);
    return (
        <div id='chart'>
            <Line 
                data = {{
                    labels: label,
                    datasets: [{
                        label: props.selector,
                        data: values
                    }]
                }}
            />
        </div>
    )
}

export default Chart