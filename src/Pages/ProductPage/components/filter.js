import React from 'react';

export const Filter = ({ nameFilter, setNameFilter, priceRange, setPriceRange, onFilterClick, onResetFilters, productTypes, selectedType, setSelectedType }) => {

    const adjustPrice = (type, amount) => {
        setPriceRange(prev => ({
            ...prev,
            [type]: Math.max((parseFloat(prev[type]) || 0) + amount, 0)
        }));
    };

    return (
        <div className="flex justify-center gap-2 flex-wrap">
            <input
                type="text"
                placeholder="Tìm theo tên sản phẩm"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none w-48 placeholder-gray-400 transition duration-300"
            />
            <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none w-48 transition duration-300"
            >
                {productTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <div className="flex gap-2 items-center">
                <div className="flex items-center">
                    <button onClick={() => adjustPrice('min', -100000)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">-100.000</button>
                    <input
                        type="number"
                        placeholder="Giá tối thiểu"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="border border-gray-300 rounded p-2 w-28"
                    />
                    <button onClick={() => adjustPrice('min', 100000)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">+100.000</button>
                </div>
                <div className="flex items-center">
                    <button onClick={() => adjustPrice('max', -100000)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">-100.000</button>
                    <input
                        type="number"
                        placeholder="Giá tối đa"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="border border-gray-300 rounded p-2 w-28"
                    />
                    <button onClick={() => adjustPrice('max', 100000)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">+100.000</button>
                </div>
            </div>
            <button onClick={onFilterClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                Xem kết quả lọc
            </button>
            <button onClick={onResetFilters} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300">
                Đặt lại bộ lọc
            </button>
        </div>
    );
};