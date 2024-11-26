import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductPageCollection } from "./components/productPageCollection.js";
import { ProductFilter } from "./components/productFilter.js";
import { getProductByType } from "../../services/productService.js";

export function ProductPage() {
    const { type } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productAll, setProductAll] = useState([]);
    const productTypes = ["Bàn phím", "Tai nghe", "Chuột", "Màn hình"];
    const [filters, setFilters] = useState({
        type: '',
        brand: '',
        priceRange: { min: '', max: '' },
        sortOrder: 'asc',
    });
    const productBrands = Array.from(new Set(productAll.map((p) => p.brand)));

    useEffect(() => {
        if (type) {
            fetchProductNeeded(type);
            resetFilters()
        }
    }, [type]);

    useEffect(() => {
        // Apply filters whenever productAll or filters change
        if (productAll.length > 0) {
            applyFilters(filters);
        }
    }, [filters, productAll]);

    const fetchProductNeeded = async (type) => {
        try {
            const response = await getProductByType(type);
            if (!response) {
                throw new Error("Failed to fetch products.");
            }
            setProductAll(response);
        } catch (error) {
            console.error("Fetch error:", error.message);
        }
    };

    const handleFilterChange = ({ priceRange, brand, sortOrder }) => {
        setFilters({ ...filters, priceRange, brand, sortOrder });
    };

    const applyFilters = ({ type, priceRange, brand, sortOrder }) => {
        let newFilteredProducts = [...productAll];
        // Filter by type
        if (type) {
            newFilteredProducts = newFilteredProducts.filter((p) => p.type === type);
        }

        // Filter by brand
        if (brand) {
            newFilteredProducts = newFilteredProducts.filter((p) => p.brand === brand);
        }
        // Filter by price range
        const minPrice = parseFloat(priceRange.min);
        const maxPrice = parseFloat(priceRange.max);
        if (!isNaN(minPrice)) {
            newFilteredProducts = newFilteredProducts.filter((p) => p.price >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            newFilteredProducts = newFilteredProducts.filter((p) => p.price <= maxPrice);
        }
        // Sort products by price
        if (sortOrder) {
            newFilteredProducts.sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));
        }
        setFilteredProducts(newFilteredProducts);
    };

    const resetFilters = () => {
        setFilters({
            type: type,
            brand: '',
            priceRange: { min: '', max: '' },
            sortOrder: 'asc',
        });
        setFilteredProducts(productAll);
    };



    return (
        <div className="my-6 max-w-7xl">
            {/* Filter Section */}
            <ProductFilter
                priceRange={filters.priceRange}
                setPriceRange={(newPriceRange) => setFilters({ ...filters, priceRange: newPriceRange })}
                selectedType={filters.type}
                setSelectedType={(newType) => setFilters({ ...filters, type: newType })}
                selectedBrand={filters.brand}
                setSelectedBrand={(newBrand) => setFilters({ ...filters, brand: newBrand })}
                productTypes={productTypes}
                productBrands={productBrands}
                selectedSort={filters.sortOrder}
                setSortOrder={(newSortOrder) => setFilters({ ...filters, sortOrder: newSortOrder })}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
            />

            {/* Product Collection Section */}
            <ProductPageCollection products={filteredProducts} />
        </div>
    );
}
