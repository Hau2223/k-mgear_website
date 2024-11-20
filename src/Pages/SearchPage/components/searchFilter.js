import React, { useState, useEffect } from 'react';

export function SearchFilter({ products, onFilterChange }) {
    const [selectableType, setselectableType] = useState('');
    const [selectableBrand, setselectableBrand] = useState('');
    const [selectablePrice, setselectablePrice] = useState('');
    const [types, setTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [prices, setPrices] = useState([]);

    // Extract unique values from the filtered products
    useEffect(() => {
        const typeFound = [
            ...new Set(products.map((product) => product.type)),
        ];
        setTypes(typeFound);
        const brandFound = [
            ...new Set(products.map((product) => product.brand)),
        ];
        setBrands(brandFound);
        const minPrice = Math.min(...products.map((product) => product.price));
        const maxPrice = Math.max(...products.map((product) => product.price));
        setPrices([minPrice, maxPrice]);
    }, [products]);

    const handleTypeChange = (e) => {
        setselectableType(e.target.value);
        onFilterChange({ type: e.target.value, brand: selectableBrand, price: selectablePrice });
    };

    const handleBrandChange = (e) => {
        setselectableBrand(e.target.value);
        onFilterChange({ type: selectableType, brand: e.target.value, price: selectablePrice });
    };

    const handlePriceChange = (e) => {
        setselectablePrice(e.target.value);
        onFilterChange({ type: selectableType, brand: selectableBrand, price: e.target.value });
    };

    return (
        <div className="flex justify-center flex-wrap gap-4 mb-6">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="type" className="text-sm font-medium text-gray-700">Loại:</label>
                <select
                    id="type"
                    value={selectableType}
                    onChange={handleTypeChange}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">Tất cả</option>
                    {types.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Brand Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="brand" className="text-sm font-medium text-gray-700">Hãng:</label>
                <select
                    id="brand"
                    value={selectableBrand}
                    onChange={handleBrandChange}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">Tất cả</option>
                    {brands.map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
                <label htmlFor="price" className="text-sm font-medium text-gray-700">Price:</label>
                <select
                    id="price"
                    value={selectablePrice}
                    onChange={handlePriceChange}
                    className="p-2 border border-gray-300 rounded"
                >

                    <option value="increase">Tăng dần</option>
                    <option value="decrease">Giảm dần</option>
                </select>
            </div>
        </div>
    );
}
