import React, { useState, useEffect } from 'react';
import { SearchFilter } from './components/searchFilter.js';
import { SearchPageCollection } from './components/searchCollection.js';
import { useParams } from 'react-router-dom';
import { getProductByTerm } from "../../services/productService";

export function SearchPage() {
    const { searchTerm } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({
        type: '',
        brand: '',
        priceRange: { min: '', max: '' },
    });
    const [productTypes, setProductTypes] = useState([]);
    const [productBrands, setProductBrands] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [productData, setProductData] = useState(null);

    // Fetch product data when component mounts or searchTerm changes
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await getProductByTerm(searchTerm);
                if (response) {
                    setProductData(response);
                } else {
                    console.error('Error fetching products');
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
            }
        };
        fetchProductData();
    }, [searchTerm]);

    // Apply filters when filters or sortOrder change
    useEffect(() => {
        if (productData) {
            let productsToFilter = productData;
            // Apply filters
            if (filters.type) {
                productsToFilter = productsToFilter.filter((product) => product.type === filters.type);  
            }
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
            const types = [...new Set(productData.map(product => product.type))];
            setProductTypes(types);

            // Filter brands based on the selected type
            if (filters.type) {
                const brands = [...new Set(productData.filter(product => product.type === filters.type).map(product => product.brand))];
                setProductBrands(brands);
            } else {
                // Show all brands if no type is selected
                const brands = [...new Set(productData.map(product => product.brand))];
                setProductBrands(brands);
            }
        }
    }, [productData, filters.type]);

    // Function to handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };
    // Function to handle sort changes
    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
    };
    return (
        <div className="m-6 max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="text-4xl font-bold text-gray-800 text-center mt-10">
                TÌM KIẾM
            </div>
            <div className="text-2xl font-medium text-gray-600 text-center mb-5">
                Tìm kiếm theo: <span className="text-blue-600 italic">{searchTerm}</span>
            </div>

            {/* Search Filter Section */}
            <SearchFilter
                priceRange={filters.priceRange}
                setPriceRange={(range) => setFilters({ ...filters, priceRange: range })}
                selectedType={filters.type}
                setSelectedType={(type) => setFilters({ ...filters, type })}
                selectedBrand={filters.brand}
                setSelectedBrand={(brand) => setFilters({ ...filters, brand })}
                productTypes={productTypes}
                productBrands={productBrands}
                onFilterChange={handleFilterChange}
                setSortOrder={handleSortChange}
            />
            <SearchPageCollection products={filteredProducts} />
        </div>
    );
}
