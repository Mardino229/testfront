
// src/components/RateChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

export default function RateChart({data}) {

    const chartData = {
        labels: data.map(d => new Date(d.date)),
        datasets: [
            {
                label: 'BTC/USD Rate',
                data: data.map(d => d.price),
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            intersect: false,
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                type: 'time',
            },
            y: {
                beginAtZero: false,
            },
        },
    };

    return <div className="md:w-1/3 w-full h-128">
            <Line data={chartData} options={options} />
        </div>
}
