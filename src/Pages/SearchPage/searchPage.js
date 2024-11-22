import React, { useState, useEffect } from 'react';
import { SearchFilter } from './components/searchFilter.js';
import { SearchPageCollection } from './components/searchCollection.js';
import { useParams } from 'react-router-dom';
import { getAll } from "../../services/productService";

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
                const response = await getAll();
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
    // Apply filters and sorting when filters, searchTerm, or sortOrder change
    useEffect(() => {
        if (productData) {
            let productsToFilter = productData;

            // First, apply searchTerm filter if it exists
            if (searchTerm) {
                productsToFilter = productsToFilter.filter(
                    (product) =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Set the available types and brands based on filtered products
            const types = [...new Set(productsToFilter.map(product => product.type))];
            const brands = [...new Set(productsToFilter.map(product => product.brand))];

            setProductTypes(types);
            setProductBrands(brands);

            // Then apply other filters and sorting
            filterProducts(productsToFilter);
        }
    }, [filters, searchTerm, sortOrder, productData]);

    // Function to filter products based on filters
    const filterProducts = (products) => {
        let filtered = [...products]; // Create a copy to avoid mutating the original

        // Apply additional filters (type, brand)
        if (filters.type) {
            filtered = filtered.filter((product) => product.type === filters.type);
        }
        if (filters.brand) {
            filtered = filtered.filter((product) => product.brand === filters.brand);
        }
        // Apply price range filter
        if (filters.priceRange.min || filters.priceRange.max) {
            filtered = filtered.filter(
                (product) =>
                    (filters.priceRange.min === '' || product.price >= filters.priceRange.min) &&
                    (filters.priceRange.max === '' || product.price <= filters.priceRange.max)
            );
        }
        // Apply sorting if sortOrder is set
        if (sortOrder === 'asc') {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            filtered = filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
    };

    // Function to handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    // Function to handle sort changes
    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder); // Update sort order
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
