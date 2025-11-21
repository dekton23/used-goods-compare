import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PriceChart = ({ stats, items }) => {
    if (!stats || stats.avg === 0) return null;

    // Create price ranges for the histogram
    // We'll create 5 bins from min to max
    const binCount = 5;
    const range = stats.max - stats.min;
    const step = range / binCount;

    const labels = [];
    const dataCounts = new Array(binCount).fill(0);

    for (let i = 0; i < binCount; i++) {
        const start = Math.floor(stats.min + i * step);
        const end = Math.floor(stats.min + (i + 1) * step);
        labels.push(`${(start / 10000).toFixed(0)}만~${(end / 10000).toFixed(0)}만`);
    }

    items.forEach(item => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        if (isNaN(price)) return;

        let binIndex = Math.floor((price - stats.min) / step);
        if (binIndex >= binCount) binIndex = binCount - 1;
        if (binIndex < 0) binIndex = 0;

        dataCounts[binIndex]++;
    });

    const data = {
        labels,
        datasets: [
            {
                label: '상품 수',
                data: dataCounts,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '가격 분포 (단위: 원)',
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">시세 분석</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Bar options={options} data={data} />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-500">예상 적정 시세 (중위값)</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.median.toLocaleString()}원</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">최저가</p>
                            <p className="font-semibold">{stats.min.toLocaleString()}원</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">평균가</p>
                            <p className="font-semibold">{stats.avg.toLocaleString()}원</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">최고가</p>
                            <p className="font-semibold">{stats.max.toLocaleString()}원</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceChart;
