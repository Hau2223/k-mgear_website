import React from 'react';
import { IMAGES } from "../constants.js";
import { FaStar } from 'react-icons/fa';

export function Card({ item }) {
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' VNĐ';
    };

    return (
        <div className="card cursor-pointer transform transition-transform duration-200 hover:scale-105 bg-white shadow-lg rounded-lg p-4 max-w-xs min-w-[200px] h-[350px] flex flex-col">
            <img
                src={item?.imageUrl ? item.imageUrl : IMAGES.PART}
                alt={item?.name || 'Product image'}
                className="h-[170px] w-full object-contain rounded-lg"
            />
            <h2 className="text-lg font-semibold text-black-600 my-2 truncate">{item.name}</h2>
            <p className="text-gray-500 line-through text-sm">{formatPrice(item.price)}</p>
            <p className="!text-red-600 text-xl font-semibold">
                {formatPrice(item.price - (item.price * (item.discount / 100)))}
                <span className="bg-[#fedee3] text-red-600 text-xs font-bold py-1 px-2 rounded-full ml-2">
                    -{item.discount}%
                </span>
            </p>
            <div className="mt-auto text-sm">
                <p className="flex items-center !text-yellow-500 font-semibold">
                    {item.rating} <FaStar className="ml-1" />
                    <span className="text-teal-400 ml-1"> ({item.totalReviews} đánh giá)</span>
                </p>
                <p className="text-blue-500">Đã bán: <span className="font-bold text-orange-500">{item.sold}</span></p>
            </div>
        </div>
    );
}
