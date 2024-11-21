import React, { useState, useEffect } from "react";
import { FaMinus, FaPlus } from 'react-icons/fa';

export const ProductFilter = ({
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
}) => {
    const [minPrice, setMinPrice] = useState(priceRange.min || "");
    const [maxPrice, setMaxPrice] = useState(priceRange.max || "");
    const [selectedSort, setSelectedSort] = useState(""); // New state for sorting option

    useEffect(() => {
        setMinPrice(priceRange.min || "");
        setMaxPrice(priceRange.max || "");
    }, [priceRange]);

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setSelectedType(newType);
        onFilterChange({ type: newType, priceRange, brand: selectedBrand, sortOrder: selectedSort });
    };

    const handleBrandChange = (e) => {
        const newBrand = e.target.value;
        setSelectedBrand(newBrand);
        onFilterChange({ type: selectedType, priceRange, brand: newBrand, sortOrder: selectedSort });
    };

    const handlePriceRangeChange = () => {
        setPriceRange({ min: minPrice, max: maxPrice });
        onFilterChange({ type: selectedType, priceRange: { min: minPrice, max: maxPrice }, brand: selectedBrand, sortOrder: selectedSort });
    };

    const handleSortChange = (e) => {
        const sortOrder = e.target.value;
        setSelectedSort(sortOrder);
        setSortOrder(sortOrder); // Pass sort order up to parent
        onFilterChange({ type: selectedType, priceRange, brand: selectedBrand, sortOrder });
    };

    const clearAllFilters = () => {
        setSelectedType(setSelectedType);
        setSelectedBrand("");
        setMinPrice("");
        setMaxPrice("");
        setPriceRange({ min: "", max: "" });
        setSelectedSort("");
        onFilterChange({ type: "", priceRange: { min: "", max: "" }, brand: "", sortOrder: "" });
    };

    // Adjust price functions
    const adjustMinPrice = (amount) => {
        setMinPrice(prevMinPrice => {
            const newMinPrice = (parseInt(prevMinPrice || 0) + amount);
            return newMinPrice > 0 ? newMinPrice : 0;
        });
    };

    const adjustMaxPrice = (amount) => {
        setMaxPrice(prevMaxPrice => {
            const newMaxPrice = (parseInt(prevMaxPrice || 0) + amount);
            return newMaxPrice >= minPrice ? newMaxPrice : minPrice;
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
                            className="p-3 bg-gray-300 text-black rounded-l hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            <FaMinus className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min"
                            className=" w-36 text-center border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => adjustMinPrice(500000)}
                            className="p-3 bg-gray-300 text-black rounded-r hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                            className="p-3 bg-gray-300 text-black rounded-l hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            <FaMinus className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max"
                            className="w-36 text-center border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => adjustMaxPrice(500000)}
                            className="p-3 bg-gray-300 text-black rounded-r hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
        </div>
    );
};
