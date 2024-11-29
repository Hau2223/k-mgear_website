import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

export function SearchFilter({
    priceRange,
    setPriceRange,
    selectedType,
    setSelectedType,
    selectedBrand,
    setSelectedBrand,
    productTypes,
    productBrands,
    onFilterChange,
    setSortOrder,
}) {
    const [minPrice, setMinPrice]
        = useState(priceRange.min || '');
    const [maxPrice, setMaxPrice]
        = useState(priceRange.max || '');
    const [selectedSort, setSelectedSort]
        = useState('asc');

    useEffect(() => {
        setMinPrice(priceRange.min || '');
        setMaxPrice(priceRange.max || '');
    }, [priceRange]);

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setSelectedType(newType);
        onFilterChange({
            type: newType,
            brand: '',
            priceRange: { min: minPrice, max: maxPrice },
            sortOrder: selectedSort,
        });
    };

    const handleBrandChange = (e) => {
        const newBrand = e.target.value;
        setSelectedBrand(newBrand);
        onFilterChange({
            type: selectedType,
            brand: newBrand,
            priceRange: { min: minPrice, max: maxPrice },
            sortOrder: selectedSort,
        });
    };

    const handlePriceRangeChange = () => {
        setPriceRange({ min: minPrice, max: maxPrice });
        onFilterChange({
            type: selectedType,
            brand: selectedBrand,
            priceRange: { min: minPrice, max: maxPrice },
            sortOrder: selectedSort,
        });
    };

    const handleSortChange = (e) => {
        const sortOrder = e.target.value;
        setSelectedSort(sortOrder);
        setSortOrder(sortOrder); // Pass sort order up to parent
        onFilterChange({
            type: selectedType,
            brand: selectedBrand,
            priceRange: { min: minPrice, max: maxPrice },
            sortOrder: sortOrder,
        });
    };

    const handleMinPriceChange = (e) => {
        const value = e.target.value;
        setMinPrice(value);
    };

    const handleMaxPriceChange = (e) => {
        const value = e.target.value;
        setMaxPrice(value);
    };

    // Adjust min price with validation
    const adjustMinPrice = (amount) => {
        let newMinPrice = (Number(minPrice) || 0) + amount;
        if (newMinPrice < 0) newMinPrice = 0; // Prevent min price from going below 0
        if (newMinPrice > (Number(maxPrice) || 0)) newMinPrice = Number(maxPrice) || 0; // Prevent min price from being greater than max price
        setMinPrice(newMinPrice.toString());
    };

    // Adjust max price with validation
    const adjustMaxPrice = (amount) => {
        let newMaxPrice = (Number(maxPrice) || 0) + amount;
        if (newMaxPrice < (Number(minPrice) || 0)) newMaxPrice = Number(minPrice) || 0; // Prevent max price from going below min price
        setMaxPrice(newMaxPrice.toString());
    };

    const clearAllFilters = () => {
        // Reset all filter states
        setSelectedType('');
        setSelectedBrand('');
        setMinPrice('');
        setMaxPrice('');
        setPriceRange({ min: '', max: '' });
        setSelectedSort(selectedSort); // Reset sort order

        // Apply the reset filter to products
        onFilterChange({
            type: '',
            brand: '',
            priceRange: { min: '', max: '' },
            sortOrder: '',
        });
    };

    return (
        <div className="flex justify-center flex-wrap gap-6 mb-6 p-4 bg-white shadow-md rounded-lg">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="type" className="text-sm font-medium text-gray-700">Loại:</label>
                <select
                    id="type"
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tất cả</option>
                    {productTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Brand Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="brand" className="text-sm font-medium text-gray-700">Hãng:</label>
                <select
                    id="brand"
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tất cả</option>
                    {productBrands.map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex gap-4 items-center">
                {/* Min Price */}
                <div className="relative flex items-center">
                    <label className="text-sm font-medium text-gray-700 mr-2">Min Price:</label>
                    <div className="flex items-center border border-gray-300 rounded">
                        <button
                            onClick={() => adjustMinPrice(-500000)}
                            className="p-3 bg-gray-300 text-black rounded-l "
                        >
                            <FaMinus className="w-5 h-5" />
                        </button>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            placeholder="Min"
                            className="p-2 w-36 text-center focus:outline-none"
                        />
                        <button
                            onClick={() => adjustMinPrice(500000)}
                            className="p-3 bg-gray-300 text-black rounded-r"
                        >
                            <FaPlus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Max Price */}
                <div className="relative flex items-center">
                    <label className="text-sm font-medium text-gray-700 mr-2">Max Price:</label>
                    <div className="flex items-center border border-gray-300 rounded">
                        <button
                            onClick={() => adjustMaxPrice(-500000)}
                            className="p-3 bg-gray-300 text-black rounded-l "
                        >
                            <FaMinus className="w-5 h-5" />
                        </button>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            placeholder="Max"
                            className="p-2 w-36 text-center focus:outline-none"
                        />
                        <button
                            onClick={() => adjustMaxPrice(500000)}
                            className="p-3 bg-gray-300 text-black rounded-r "
                        >
                            <FaPlus className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sort by Price */}
            <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sắp xếp theo giá:</label>
                <select
                    id="sort"
                    value={selectedSort}
                    onChange={handleSortChange}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="asc">Giá tăng dần</option>
                    <option value="desc">Giá giảm dần</option>
                </select>
            </div>

            {/* Apply Filter Button for Price Range */}
            <div className="flex items-center">
                <button
                    onClick={handlePriceRangeChange}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Xem kết quả
                </button>
            </div>

            {/* Clear All Filters Button */}
            <div className="flex items-center">
                <button
                    onClick={clearAllFilters}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Đặt lại
                </button>
            </div>

            {/*remove spin */}
            <style>
                {`
                    input[type="number"] {
                        appearance: none;
                        -moz-appearance: textfield;
                        -webkit-appearance: none;
                    }

                    input[type="number"]::-webkit-outer-spin-button,
                    input[type="number"]::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                `}
            </style>
        </div>

    );
}



