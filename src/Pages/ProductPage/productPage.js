import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductPageCollection } from "./components/productPageCollection.js";
import { ProductFilter } from "./components/productFilter.js";
import product from "../../utils/product.json";

export function ProductPage() {
    const navigate = useNavigate(); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
    const [selectedType, setSelectedType] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedSort, setSelectedSort] = useState("");

    // Extract unique product types from product data
    const productTypes = Array.from(new Set(product.map((p) => p.type)));

    // Extract unique brands from product data
    const productBrands = Array.from(new Set(product.map((p) => p.brand)));

    useEffect(() => {
        // If the type is not set from the URL, default to the first available product type
        if (!selectedType && productTypes.length > 0) {
            setSelectedType(productTypes[0]);
        }
    }, [productTypes, selectedType]);

    useEffect(() => {
        const filteredByType = product.filter((p) => p.type === selectedType);
        setFilteredProducts(filteredByType);

        // When selectedType changes, navigate to the new link
        if (selectedType) {
            navigate(`/collections/${selectedType}`);
        }
    }, [selectedType, navigate]);

    const handleFilterChange = ({ type, priceRange, brand, sortOrder }) => {
        let newFilteredProducts = product.filter((p) => p.type === selectedType);

        const minPrice = parseFloat(priceRange.min);
        const maxPrice = parseFloat(priceRange.max);

        if (brand) {
            newFilteredProducts = newFilteredProducts.filter((p) => p.brand === brand);
        }

        if (!isNaN(minPrice)) {
            newFilteredProducts = newFilteredProducts.filter((p) => p.price >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            newFilteredProducts = newFilteredProducts.filter((p) => p.price <= maxPrice);
        }

        if (sortOrder) {
            newFilteredProducts = newFilteredProducts.sort((a, b) => {
                return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
            });
        }

        setFilteredProducts(newFilteredProducts);
    };

    const resetFilters = () => {
        setPriceRange({ min: 0, max: 1000000 });
        setFilteredProducts(product.filter((p) => p.type === selectedType));
    };

    return (
        <div className="my-6 max-w-7xl">
            {/* Filter Section */}
            <ProductFilter
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                productTypes={productTypes}
                productBrands={productBrands}  // Pass extracted product brands here
                selectedSort={selectedSort} // Pass selectedSort here
                setSortOrder={setSelectedSort} // Pass setSortOrder here
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
            />

            {/* Product Collection Section */}
            <ProductPageCollection type={selectedType} products={filteredProducts} />
        </div>
    );
}
