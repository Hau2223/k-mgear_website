import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../utils/components/Card.js";

export function ProductPageCollection({ type, products }) {
    const navigate = useNavigate();

    const handleCardClick = (itemId) => {
        navigate(`/product/${itemId}`);
    };

    return (
        <div className="p-4 mx-2 md:mx-10 border border-black rounded-lg">
            <div className="mb-5 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tất cả sản phẩm {type}</h1>
            </div>
            <div className="flex justify-between flex-nowrap gap-2 overflow-x-auto p-2">
                {products.length > 0 ? (
                    products.filter((item) => item?.type === type).map((item) => (
                        <div key={item._id} onClick={() => handleCardClick(item._id)} className="cursor-pointer">
                            <Card item={item} />
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm nào để hiển thị.</p>
                )}
            </div>
        </div>
    );
}