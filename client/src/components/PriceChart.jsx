import React from 'react';

const PriceChart = ({ stats }) => {
    if (!stats || stats.median === 0) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">시세 분석</h2>
            <div className="flex justify-center">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-100 text-center w-full max-w-md">
                    <p className="text-sm text-gray-500 mb-2">예상 적정 시세 (중위값)</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.median.toLocaleString()}원</p>
                </div>
            </div>
        </div>
    );
};

export default PriceChart;
