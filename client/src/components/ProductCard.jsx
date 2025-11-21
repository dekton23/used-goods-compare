import React from 'react';

const ProductCard = ({ product }) => {
    const { platform, title, price, region, link, image_url } = product;

    const getPlatformColor = (platform) => {
        switch (platform) {
            case 'daangn': return 'bg-orange-500';
            case 'bunjang': return 'bg-red-500';
            case 'joongna': return 'bg-green-600';
            default: return 'bg-gray-500';
        }
    };

    const getPlatformName = (platform) => {
        switch (platform) {
            case 'daangn': return '당근마켓';
            case 'bunjang': return '번개장터';
            case 'joongna': return '중고나라';
            default: return platform;
        }
    };

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {image_url ? (
                        <img
                            src={image_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                    <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded shadow-sm ${getPlatformColor(platform)}`}>
                        {getPlatformName(platform)}
                    </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm text-gray-900 font-medium line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                            {title}
                        </h3>
                        <p className="text-lg font-bold text-gray-900 mb-1">{price}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>{region}</span>
                        {/* <span>{time}</span> */}
                    </div>
                </div>
            </div>
        </a>
    );
};

export default ProductCard;
