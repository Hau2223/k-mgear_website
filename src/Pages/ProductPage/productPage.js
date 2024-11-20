import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { ProductPageCollection } from "./components/productPageCollection.js";
import { Filter } from "./components/filter.js";
import product from "../../utils/product.json";

export function ProductPage() {
    const { type } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [nameFilter, setNameFilter] = useState('');
    const [selectedType, setSelectedType] = useState(type);
    const productTypes = [...new Set(product.map(({ type }) => type))];
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredProducts(product);
    }, []);

    const handleFilterClick = () => {
        let newFilteredProducts = product;

        // Filter by name
        if (nameFilter) {
            newFilteredProducts = newFilteredProducts.filter(product =>
                product.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        // Filter by price
        const minPrice = parseFloat(priceRange.min);
        const maxPrice = parseFloat(priceRange.max);

        if (!isNaN(minPrice)) {
            newFilteredProducts = newFilteredProducts.filter(product => product.price >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            newFilteredProducts = newFilteredProducts.filter(product => product.price <= maxPrice);
        }

        // Filter by selected type
        if (selectedType) {
            handleViewAllClick(selectedType);
        }

        setFilteredProducts(newFilteredProducts);
        console.log("Filtering with:", { nameFilter, priceRange, selectedType });
        console.log("Filtered Products:", newFilteredProducts);
    };

    const handleViewAllClick = (type) => {
        navigate(`/collections/${type}`);
    };

    const resetFilters = () => {
        setNameFilter('');
        setPriceRange({ min: '', max: '' });
        setSelectedType(type);
        setFilteredProducts(product);
    };

    return (
        <div className="flex flex-col w-4/5 mx-auto border border-gray-300">
            <div className="flex justify-center items-center border-b border-gray-300 w-full sticky top-0 bg-white z-50 h-20">
                <Filter
                    nameFilter={nameFilter}
                    setNameFilter={setNameFilter}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    onFilterClick={handleFilterClick}
                    onResetFilters={resetFilters}
                    productTypes={productTypes}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                />
            </div>
            <ProductPageCollection type={type} products={filteredProducts} />
        </div>
    );
}