import React, { useState, useEffect } from 'react';
import { SearchFilter } from './components/searchFilter.js';
import { SearchPageCollection } from './components/searchCollection.js';
import { useParams } from 'react-router-dom';
import products from '../../utils/product.json';

export function SearchPage() {
    const { searchTerm } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({ type: '', brand: '', price: 'increase' });


    // Function to filter products based on the search term and filters
    const filterProducts = () => {
        let filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by search term
        );

        // Apply additional filters (type, brand, price)
        if (filters.type) {
            filtered = filtered.filter((product) => product.type === filters.type);
        }
        if (filters.brand) {
            filtered = filtered.filter((product) => product.brand === filters.brand);
        }
        if (filters.price) {
            filtered = filtered.sort((a, b) =>
                filters.price === 'increase' ? a.price - b.price : b.price - a.price
            );
        }

        setFilteredProducts(filtered);
    };
    useEffect(() => {
        filterProducts();
    }, []);
    
    useEffect(() => {
        filterProducts();
    }, [searchTerm, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 my-3">
            <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg border-black">
                {/* Search Header */}
                <div className="text-3xl font-semibold text-gray-800 text-center">
                    TÌM KIẾM
                </div>
                {filteredProducts.length > 0 ? (
                    <>
                        <div className="text-lg text-gray-600 mb-8 text-center">
                            Tìm kiếm theo: <span className="font-bold text-red">{searchTerm}</span>
                        </div>
                        <SearchFilter products={filteredProducts} onFilterChange={handleFilterChange} />
                        {/* Search Results Collection */}
                        <SearchPageCollection products={filteredProducts} />
                    </>
                ) : (
                    <div className="text-center text-gray-600">
                        Rất tiếc, chúng tôi không tìm thấy kết quả cho từ khóa của bạn.
                        <br />
                        Vui lòng kiểm tra chính tả, sử dụng các từ tổng quát hơn và thử lại!
                    </div>
                )}
            </div>
        </div>
    );
}
