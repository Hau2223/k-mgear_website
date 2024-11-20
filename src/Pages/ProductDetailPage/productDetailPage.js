import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import product from "../../utils/product.json";
import { FaStar } from 'react-icons/fa';

export function ProductDetailPage() {
    return <ProductDetailPageBody />;
}

export function ProductDetailPageBody() {
    const { id } = useParams();
    const [productData, setProductData] = useState(null);  // Default to null

    useEffect(() => {
        const productDetails = product.find((item) => item._id === id);
        setProductData(productDetails);
    }, [id]);

    const handleBuyNow = (product) => {
        alert("Buying product: " + product);
        console.log("Buying product:", product);
    };

    const handleAddToCart = (productID) => {
        const existingCarts = [];

        if (existingCarts.find((item) => item.productID === productID)) {
            return;
        }

        const now = new Date();
        const formattedDateTime = now.toLocaleString();

        const newCartItem = {
            _id: `cart_${existingCarts.length}`,
            productID: productID,
            quantity: 1,
            status: "waiting",
            date: formattedDateTime,
        };

        const updatedCarts = [...existingCarts, newCartItem];
        localStorage.setItem("carts", JSON.stringify(updatedCarts));

        alert("Item added to cart!");
    };

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN') + ' VNĐ'; 
    };

    // Wait until the productData is loaded before rendering the component
    if (!productData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row items-center p-6 max-w-5xl mx-auto my-10 border rounded-lg shadow-lg bg-white">
            {/* Product Image */}
            <div className="flex-[5] flex justify-center items-center mb-6 md:mb-0 md:mr-8">
                <div className="w-full h-72 overflow-hidden rounded-lg">
                    <img
                        src={productData?.imageUrl || "/path/to/fallback-image.jpg"}
                        alt={productData?.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-[6] px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{productData?.name}</h1>

                {/* Flash Sale Badge */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 inline-block text-sm uppercase font-bold rounded-full mb-4 shadow-lg">
                    Flash Sale
                </div>

                <div className="flex items-center mb-6">
                    <span className="text-gray-500 line-through text-lg mr-4">
                        {formatPrice(productData?.price)} VND
                    </span>
               
                    <span className="bg-[#fedee3] text-red-600 text-xs font-bold py-1 px-2 rounded-full ml-2">
                        -{productData?.discount}%
                    </span>
              
                    <p className="!text-red-600 text-xl font-semibold ml-2">
                        {formatPrice(productData?.price - (productData?.price * (productData?.discount / 100)))}
                    </p>
                </div>

                <div className="space-y-2 text-gray-600 mb-8">
                    <p>
                        Còn lại:{" "}
                        <strong>{productData?.quantity}</strong>
                    </p>
                    <p>
                        Hãng: <strong className="text-blue-500">{productData?.brand}</strong>
                    </p>
                    <p className="flex items-center !text-yellow-500 font-semibold">
                        {productData?.rating} <FaStar className="ml-1" />
                        <span className="text-teal-400 ml-1"> ({productData?.totalReviews} đánh giá)</span>
                    </p>
                    <p>
                        Đã bán:{" "}
                        <strong className="text-orange-500">{productData?.sold}</strong>
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        className="px-6 py-3 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors duration-300"
                        onClick={() => handleBuyNow(productData?._id)}
                    >
                        Mua Ngay
                    </button>
                    <button
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors duration-300"
                        onClick={() => handleAddToCart(productData?._id)}>
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
}
