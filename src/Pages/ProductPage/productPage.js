import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductPageCollection } from "./components/productPageCollection.js";
import { ProductFilter } from "./components/productFilter.js";
import { getProductByType } from "../../services/productService.js";

export function ProductPage() {
    const { type } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({
        brand: '',
        priceRange: { min: '', max: '' },
    });
    const [productBrands, setProductBrands] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        const fetchProductNeeded = async (type) => {
            try {
                const response = await getProductByType(type);
                if (response) {
                    setProductData(response);
                } else {
                    console.error('Error fetching products');
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
            }
        };
        fetchProductNeeded(type);
    }, [type]);

    useEffect(() => {
        if (productData) {
            let productsToFilter = productData;
            if (filters.brand) {
                productsToFilter = productsToFilter.filter((product) => product.brand === filters.brand);
            }
            if (filters.priceRange.min || filters.priceRange.max) {
                productsToFilter = productsToFilter.filter(
                    (product) =>
                        (filters.priceRange.min === '' || product.price >= filters.priceRange.min) &&
                        (filters.priceRange.max === '' || product.price <= filters.priceRange.max)
                );
            }
            // Apply sorting
            if (sortOrder === 'asc') {
                productsToFilter = productsToFilter.sort((a, b) => a.price - b.price);
            } else if (sortOrder === 'desc') {
                productsToFilter = productsToFilter.sort((a, b) => b.price - a.price);
            }
            // Set filtered products
            setFilteredProducts(productsToFilter);
        }
    }, [filters, sortOrder, productData]);
    // Update available types and brands when product data changes
    useEffect(() => {
        if (productData) {
            const brands = [...new Set(productData.map(product => product.brand))];
            setProductBrands(brands);
        }
    }, [productData]);

    // Function to handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    // Function to handle sort changes
    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
    };

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
                setPriceRange={(range) => setFilters({ ...filters, priceRange: range })}
                selectedBrand={filters.brand}
                setSelectedBrand={(brand) => setFilters({ ...filters, brand })}
                productBrands={productBrands}
                onFilterChange={handleFilterChange}
                setSortOrder={handleSortChange}
            />
            {/* Product Collection Section */}
            <ProductPageCollection products={filteredProducts} />
        </div>
    );
}
