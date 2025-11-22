import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import PriceChart from '../components/PriceChart';

const SearchPage = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState({ items: [], stats: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('all'); // all, 1day, 3days, 7days

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setLoading(true);
        setError(null);
        setResults({ items: [], stats: null });

        try {
            const response = await fetch(`http://localhost:3000/api/search?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError('검색 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterItems = (items) => {
        if (dateFilter === 'all') return items;

        const now = new Date();
        const limit = new Date();

        if (dateFilter === '1day') limit.setDate(now.getDate() - 1);
        if (dateFilter === '3days') limit.setDate(now.getDate() - 3);
        if (dateFilter === '7days') limit.setDate(now.getDate() - 7);

        return items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= limit;
        });
    };

    const filteredItems = filterItems(results.items || []);

    // Group by platform
    const daangnItems = filteredItems.filter(i => i.platform === 'daangn');
    const bunjangItems = filteredItems.filter(i => i.platform === 'bunjang');
    const joongnaItems = filteredItems.filter(i => i.platform === 'joongna');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">중고 거래 가격 비교</h1>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 flex gap-2">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="상품명을 입력하세요 (예: 맥북, 아이폰)"
                    className="flex-1 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                    {loading ? '검색 중...' : '검색'}
                </button>
            </form>

            {error && <p className="text-center text-red-500 mb-8">{error}</p>}

            {results.stats && (
                <>
                    <PriceChart stats={results.stats} />

                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setDateFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${dateFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setDateFilter('1day')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${dateFilter === '1day' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            최근 1일
                        </button>
                        <button
                            onClick={() => setDateFilter('3days')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${dateFilter === '3days' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            최근 3일
                        </button>
                        <button
                            onClick={() => setDateFilter('7days')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${dateFilter === '7days' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            최근 1주일
                        </button>
                    </div>
                </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Daangn Column */}
                <div className="bg-orange-50 p-4 rounded-xl">
                    <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center">
                        <span className="mr-2">🥕</span> 당근마켓 ({daangnItems.length})
                    </h2>
                    <div className="space-y-4">
                        {daangnItems.map((item, index) => (
                            <ProductCard key={`daangn-${index}`} product={item} />
                        ))}
                        {daangnItems.length === 0 && results.stats && <p className="text-gray-500 text-center py-4">검색 결과가 없습니다.</p>}
                    </div>
                </div>

                {/* Bunjang Column */}
                <div className="bg-red-50 p-4 rounded-xl">
                    <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                        <span className="mr-2">⚡</span> 번개장터 ({bunjangItems.length})
                    </h2>
                    <div className="space-y-4">
                        {bunjangItems.map((item, index) => (
                            <ProductCard key={`bunjang-${index}`} product={item} />
                        ))}
                        {bunjangItems.length === 0 && results.stats && <p className="text-gray-500 text-center py-4">검색 결과가 없습니다.</p>}
                    </div>
                </div>

                {/* Joongna Column */}
                <div className="bg-green-50 p-4 rounded-xl">
                    <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center">
                        <span className="mr-2">🏷️</span> 중고나라 ({joongnaItems.length})
                    </h2>
                    <div className="space-y-4">
                        {joongnaItems.map((item, index) => (
                            <ProductCard key={`joongna-${index}`} product={item} />
                        ))}
                        {joongnaItems.length === 0 && results.stats && <p className="text-gray-500 text-center py-4">검색 결과가 없습니다.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
