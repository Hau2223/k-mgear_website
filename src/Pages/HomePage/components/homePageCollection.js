import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../utils/components/Card.js";
import { getProductByType } from "../../../services/productService.js";

export function HomePageCollection({ type }) {
    const [productAll, setProductAll] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
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
        fetchProductNeeded(type)
    },);

    const handleCardClick = (itemId) => {
        navigate(`/product/${itemId}`);
    };

    const handleViewAllClick = () => {
        navigate(`/collections/${type}`);
    };

    return (
        <div className="p-4 my-5 border bg-slate-100 rounded-lg flex flex-col text-left">
            {/* Header Section */}
            <div className="flex items-center mb-2 px-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                    {type} HOT NHẤT
                </h1>
                <div className="ml-auto">
                    <button
                        onClick={handleViewAllClick}
                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg rounded-lg px-4 py-2 cursor-pointer border-none shadow-md transition-all duration-300 hover:from-orange-500 hover:to-yellow-500 hover:text-white">
                        Xem tất cả
                    </button>
                </div>
            </div>
            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-evenly mx-auto gap-3 ">
                {productAll
                    .filter((item) => item?.type === type)
                    .slice(0, 4)
                    .map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(item._id)}
                            className="cursor-pointer hover:scale-100 transform transition-transform duration-300"
                        >
                            <Card
                                item={{...item}}
                            />
                        </div>
                    ))}
            </div>
        </div>

    );
}
