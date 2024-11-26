import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductPageCollection } from "./components/productPageCollection.js";
import { ProductFilter } from "./components/productFilter.js";
import { getProductByType } from "../../services/productService.js";

export function ProductPage() {
    const { type } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productAll, setProductAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        brand: '',
        priceRange: { min: '', max: '' },
        sortOrder: 'asc',
    });

    const productBrands = Array.from(new Set(productAll.map((p) => p.brand)));

    useEffect(() => {
        if (type) {
            fetchProductNeeded(type);
            resetFilters();
        }
    }, [type]);

    useEffect(() => {
        // Apply filters whenever productAll or filters change
        if (productAll.length > 0) {
            applyFilters(filters);
        }
    }, [filters, productAll]);

    const fetchProductNeeded = async (type) => {
        setLoading(true);
        try {
            const response = await getProductByType(type);
            if (!response) {
                throw new Error("No products found.");
            }
            setProductAll(response);
        } catch (error) {
            setError("Failed to fetch products. Please try again later.");
            console.error("Fetch error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = ({ priceRange, brand, sortOrder }) => {
        let newFilteredProducts = [...productAll];

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
            brand: '',
            priceRange: { min: '', max: '' },
            sortOrder: 'asc',
        });
        setFilteredProducts(productAll);
    };

    const handleFilterChange = (filters) => {
        setFilters(filters);  // Update filters state
    };

    if (loading) {
        return <div className="text-center">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="my-6 max-w-7xl">
            <div className="text-4xl font-bold text-gray-800 text-center mt-10">
                BỘ SƯU TẬP
            </div>
            <div className="text-2xl font-medium text-gray-600 text-center mb-5">
                Sản phẩm: <span className="text-blue-600 italic">{type}</span>
            </div>

            {/* Filter Section */}
            <ProductFilter
                priceRange={filters.priceRange}
                setPriceRange={(newPriceRange) => setFilters({ ...filters, priceRange: newPriceRange })}
                selectedBrand={filters.brand}
                setSelectedBrand={(newBrand) => setFilters({ ...filters, brand: newBrand })}
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
