import React from 'react';
import { IMAGES } from "../constants.js";
import { FaStar } from 'react-icons/fa';

export function Card({ item }) {
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' VNĐ';
    };

    return (
        <div className="card cursor-pointer border bg-white transform transition-transform duration-200 hover:scale-105 shadow-lg rounded-lg p-4 w-72 h-[350px] flex flex-col">
            <div className="h-[170px] w-full overflow-hidden rounded-lg mb-3">
                <img
                    src={item?.imageUrl ? item.imageUrl : IMAGES.PART}
                    alt={item?.name || 'Product image'}
                    className="w-full h-full object-contain"
                />
            </div>
            <h2 className="text-lg font-semibold text-black-600 my-1 truncate">{item.name}</h2>
            {item.discount && item.discount > 0 ? (
                <>
                    <p className="text-gray-500 line-through text-sm mb-1">
                        {formatPrice(item.price)}
                    </p>
                    <p className="!text-red-600 text-xl font-semibold mb-2">
                        {formatPrice(item.price - (item.price * (item.discount / 100)))}
                        <span className="bg-[#fedee3] text-red-600 text-xs font-bold px-2 rounded-full ml-2">
                            -{item.discount}%
                        </span>
                    </p>
                </>
            ) : (
                <p className="text-red-600 text-xl font-semibold mb-2">
                    {formatPrice(item.price)}
                </p>
            )}
            <div className="my-auto text-sm">
                <p className="flex items-center !text-yellow-500 font-semibold mb-1">
                    {item.rating} <FaStar className="ml-1" />
                    <span className="text-teal-400 ml-1"> ({item.totalReviews} đánh giá)</span>
                </p>
                <p className="text-blue-500">Đã bán: <span className="font-bold text-orange-500">{item.sold}</span></p>
            </div>
        </div>
    );
}
