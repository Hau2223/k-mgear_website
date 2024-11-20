import React from "react";
import { useNavigate } from "react-router-dom";
import product from "../../../utils/product.json";
import { Card } from "../../../utils/components/Card.js";

export function HomePageCollection({ type }) {
    const navigate = useNavigate();

    const handleCardClick = (itemId) => {
        navigate(`/product/${itemId}`);
    };

    const handleViewAllClick = () => {
        navigate(`/collections/${type}`);
    };

    return (
        <div className="p-4 mb-4 flex flex-col text-left">
            {/* Header Section */}
            <div className="flex items-center mb-5 px-4">
                <h1 className="text-2xl font-bold m-0">{type} HOT NHẤT</h1>
                <div className="ml-auto">
                    <button
                        onClick={handleViewAllClick}
                        className="bg-red-500 text-white text-lg rounded px-4 py-2 cursor-pointer border-none transition-all duration-300 hover:bg-white hover:text-red-500"
                    >
                        Xem tất cả
                    </button>
                </div>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                {product
                    .filter((item) => item?.type === type)
                    .slice(0, 4)
                    .map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(item._id)}
                            className="cursor-pointer"
                        >
                            <Card item={item} />
                        </div>
                    ))}
            </div>
        </div>
    );
}
