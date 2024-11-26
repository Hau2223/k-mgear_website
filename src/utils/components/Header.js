import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaHeadset, FaMapMarkerAlt, FaCamera, FaShoppingCart, FaNewspaper, FaBook, FaCoins, FaShieldAlt } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/Logo.png";
import product from "../../utils/product.json";
import cart from "../../utils/cart.json";
import { getCartByIdUserStatus } from "../../services/cartService";
import { getAll, getProductById } from "../../services/productService.js";


const Cart = ({ }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [carts, setCarts] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (isHovered) {
            loadCarts();
        }
    }, [isHovered]);

    useEffect(() => {
        if (carts.length > 0) {
            const fetchProducts = async () => {
                const productData = await Promise.all(
                    carts.map(async (cart) => await getProductById(cart.idProduct))
                );
                setProducts(productData);
            };
            fetchProducts();
        }
    }, [carts]);

    return (
        <div
            className="relative block h-max"
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
        >
            <div className="flex items-center">
                <FaShoppingCart />
                <span className="ml-1">Giỏ hàng</span>
            </div>
            {isHovered && (
                <div className="absolute top-5 right-0 w-80 max-h-96 overflow-y-auto bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-10">
                    <h2 className="text-lg mb-4 text-gray-800">Giỏ hàng</h2>
                    {products.length > 0 ? (
                        <ul className="list-none m-0 p-0">
                            {products.map((item, index) => (
                                <li className="flex items-center border-b border-gray-200 py-3" key={index}>
                                    <img
                                        className="w-12 h-12 rounded-md mr-3 object-cover"
                                        src={item?.imageUrl}
                                        alt={item?.name}
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>{item?.name}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 text-sm">Giỏ hàng của bạn đang trống.</p>
                    )}
                    <Link to="/cart" className="block w-full py-3 mt-4 bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 font-bold text-white text-md no-underline text-center">Xem giỏ hàng</Link>
                </div>
            )}
        </div>
    );
};

export function Header() {
    const [productData, setProductData] = useState([]);
    const navigate = useNavigate();
    const [productAll, setProductAll] = useState([]);
    useEffect(() => {
        fetchAllProduct();
    }, []);    
    
    useEffect(() => {
        fetchAllProduct();
    }, []);

    const fetchAllProduct = async () => {
        try {
            const response = await getAll();
            if (!response) {
                throw new Error('Network response was not ok');
            } else {
                setProductData(response)
            }
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    }

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', '').trim();
    };

    const SearchBar = ({ productData }) => {
        const [searchTerm, setSearchTerm] = useState('');
        const [searchResults, setSearchResults] = useState([]);
        const [placeholder, setPlaceholder] = useState("Tìm kiếm...");
        const searchResultsRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (!searchResultsRef.current?.contains(event.target)) {
                    setSearchResults([]);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const handleSearch = (term) => {
            setSearchTerm(term);
            if (term) {
                setPlaceholder("Search...");
                const lowerCaseTerm = term.toLowerCase();
                const results = productData
                    .filter(product =>
                        product?.name.toLowerCase().includes(lowerCaseTerm) ||
                        product?.brand.toLowerCase().includes(lowerCaseTerm) ||
                        product?.type.toLowerCase().includes(lowerCaseTerm)
                    )
                    .slice(0, 5);
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        };

        const handleClickSearchIcon = () => {
            if (searchTerm !== "") {
                navigate(`/search/${searchTerm}`);
            }
            else {
                setPlaceholder('Bạn cần tìm gì ?')
            }
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && searchTerm !== "") {
                navigate(`/search/${searchTerm}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            else {
                setPlaceholder('Bạn cần tìm gì ?')
            }
        };

        const handleChange = (e) => {
            const term = e.target.value;
            setSearchTerm(term);
            handleSearch(term);
        };

        return (
            <div className="relative flex items-center w-full max-w-md">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    placeholder={placeholder}
                    className="py-2 px-4 border-gray-300 rounded w-full text-black"
                />
                <FaSearch
                    className="absolute right-3 text-gray-500 cursor-pointer"
                    onClick={() => handleClickSearchIcon()}
                />
                {searchResults.length > 0 && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto"
                        ref={searchResultsRef}
                    >
                        {searchResults.slice(0, 4).map((product) => (
                            <Link
                                key={product._id}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                to={`/product/${product._id}`}
                                className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                            >
                                <div className="flex-grow">
                                    <p className="text-lg text-black font-semibold" >{product.name}</p>
                                    <div className="flex items-center">
                                        {product.discount > 0 && (
                                            <p className="text-red-500 font-semibold pr-1">
                                                {formatPrice(product.price * (1 - product.discount / 100))}
                                            </p>
                                        )}
                                        <p className={`text-gray-500 ${product.discount > 0 ? 'line-through mr-2' : 'text-red-500 font-semibold'}`}>
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                </div>
                                <img
                                    src={product?.imageUrl}
                                    alt={product.name}
                                    className="w-20 h-20 object-contain ml-auto px-1"
                                />
                            </Link>
                        ))}
                        {searchResults.length > 4 && (
                            <div
                                className="text-center text-black py-2 hover:text-red-500 border-t hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleClickSearchIcon()}
                            >
                                Xem thêm
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col bg-red-600 sticky top-0 z-50 text-white w-full">
            {/* Top Header */}
            <div className="flex justify-between items-center py-2 max-w-screen-xl mx-auto w-full bg-red-600">
                {/* Logo */}
                <div className="flex items-center w-1/10">
                    <div className="cursor-pointer">
                        <Link to={`/`}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                            <img src={logo} alt="Logo" className="w-20 h-20 object-cover" />
                        </Link>
                    </div>

                </div>
                {/* SearchBar */}
                <div className="flex-grow mx-4">
                    <SearchBar productData={productData} />
                </div>
                {/* Links */}
                <div className="flex space-x-10 text-sm font-bold items-center w-5/10 justify-evenly">
                    <Link to="tel:012345678" className="flex items-center">
                        <FaHeadset className="mr-2" /> Hotline 1900.5301
                    </Link>
                    <Link to="/" className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" /> Hệ thống Showroom
                    </Link>
                    <Link to="/" className="flex items-center">
                        <FaCamera className="mr-2" /> Tra cứu đơn hàng
                    </Link>
                    <Cart />
                </div>
            </div>

            {/* Sub Header */}
            <div className="bg-white text-gray-800 border-b border-gray-300">
                <div className="flex justify-center items-center space-x-6 py-4 text-sm font-bold max-w-screen-xl mx-auto w-full">
                    <Link to="/" className="flex items-center cursor-pointer hover:text-red-600 border-r-2 border-gray-300 pr-6">
                        <FaNewspaper className="mr-2" /> Tin công nghệ
                    </Link>
                    <Link to="/" className="flex items-center cursor-pointer hover:text-red-600 border-r-2 border-gray-300 pr-6">
                        <FaCoins className="mr-2" /> Hướng dẫn thanh toán
                    </Link>
                    <Link to="/" className="flex items-center cursor-pointer hover:text-red-600 border-r-2 border-gray-300 pr-6">
                        <FaBook className="mr-2" /> Hướng dẫn bảo dưỡng
                    </Link>
                    <Link to="/" className="flex items-center cursor-pointer hover:text-red-600 pr-6">
                        <FaShieldAlt className="mr-2" /> Tra cứu bảo hành
                    </Link>
                </div>
            </div>
        </div>
    );
}
