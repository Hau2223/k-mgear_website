import React, { useState, useEffect } from "react";
import { getCartByIdUserStatus, deleteCart } from "../../services/cartService";
import { getProductById } from "../../services/productService";
import { useNavigate } from "react-router-dom";

const userID = localStorage.getItem("userID");
export function CartPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [carts, setCarts] = useState([]);
    useEffect(() => {
        const loadCarts = async () => {
            try {
                var cartData = [];
                if (!userID) {
                    cartData = await JSON.parse(localStorage.getItem("productIDs"));
                } else {
                    cartData = await getCartByIdUserStatus({
                        idUser: userID,
                        status: "cart",
                    });
                }
                setCarts(await cartData);
                const productData = await Promise.all(
                    cartData.map(async (data) => {
                        const product =
                            await getProductById(userID ? data.idProduct : data);
                        if (product.quantity > 0) {
                            return {
                                ...product,
                                quantity: 1,
                            };
                        }
                        return {
                            ...product,
                            quantity: 0,
                        };
                    })
                );
                setProducts(productData);
            } catch (error) {
                console.error("Error loading cart data:", error);
            }
        };
        loadCarts();
    }, []);
    const toggleProductSelection = (id) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter(
                    (productId) => productId !== id)
                : [...prevSelected, id]
        );
    };
    const updateQuantity = async (id, amount) => {
        var max = (await getProductById(id)).quantity
        setProducts((prevItems) =>
            prevItems.map((item) => {
                if (item._id === id) {
                    if (max > item.quantity + amount) {
                        max = item.quantity + amount
                    }
                    const updatedItem = {
                        ...item,
                        quantity: Math.max(0, max),
                    };
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const removeItem = async (id) => {
        if (userID) {
            const response = await deleteCart(
                carts.find((cart) => cart.idProduct == id)._id
            );
            alert(response)
        } else {
            const data = await JSON.parse(localStorage.getItem("productIDs"));
            const removedData = data.filter((e) => e !== id);
            localStorage.setItem("productIDs", JSON.stringify(removedData));
        }
        setProducts((prevItems) => prevItems.filter((item) => item._id !== id));
        setSelectedProducts((prevSelected) =>
            prevSelected.filter((productId) => productId !== id)
        );
    };

    // Calculate total price for selected products
    const totalPrice = products
        .filter((item) => selectedProducts.includes(item._id))
        .reduce(
            (total, item) =>
                total + (item.price - (item.price * item.discount) / 100) * item.quantity, 0
        );
    function handleSubmit() {
        const selectedPro = products.filter(
            (product) => selectedProducts.includes(product._id))
        localStorage.setItem("selectedProducts", JSON.stringify(selectedPro));
        navigate("/cartInfo");
    }
    return (

        <div className="max-w-3xl mx-auto p-6 font-sans">
            <div className="bg-white shadow rounded-lg p-4 border">
                <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">Giỏ hàng</h1>
                {products.map((item) => (
                    <div key={item.id} className="flex items-center  mb-4 border-b pb-4 relative"
                    >
                        <input disabled={item.quantity <= 0} type="checkbox" className="w-5 h-5 mr-4 accent-red-600"
                            checked={selectedProducts.includes(item._id)}
                            onChange={() => toggleProductSelection(item._id)}
                        />
                        <div className="flex items-center ">
                            <div className="flex flex-col items-center mr-4">
                                <img
                                    src={item.imageUrl || "https://via.placeholder.com/80"}
                                    alt={item.name}  className="w-28 h-28 object-cover rounded-lg"/>
                                <button
                                    onClick={() => removeItem(item._id)}
                                    className="text-red-500 text-sm mt-2 hover:underline">
                                    Xóa
                                </button>
                            </div>
                            <div className="flex flex-col flex-1">
                                <h2
                                    className="text-lg font-medium cursor-pointer"
                                    onClick={() => navigate(`/product/${item._id}`)}>
                                    {item.name}
                                </h2>
                                <p className="text-sm text-gray-500 line-through">
                                    {item.price.toLocaleString("vi-VN") + "đ"}
                                </p>
                                <p className="text-red-600 font-semibold text-lg">
                                    {(item.price -(item.price * item.discount) / 100).toLocaleString("vi-VN")}
                                    đ
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 absolute right-0">
                            <button
                                disabled={item.quantity <= 0}
                                onClick={() => updateQuantity(item._id, -1)}
                                className="w-8 h-8 bg-gray-200 rounded text-lg font-bold text-gray-700 flex items-center justify-center"
                            >
                                -
                            </button>
                            <span className="text-lg">{item.quantity}</span>
                            <button
                                disabled={item.quantity <= 0}
                                onClick={() => updateQuantity(item._id, 1)}
                                className="w-8 h-8 bg-gray-200 rounded text-lg font-bold text-gray-700 flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Tổng tiền:</span>
                    <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <button
                    disabled={selectedProducts.length === 0}
                    className={`w-full py-3 rounded-lg mt-4 text-lg font-bold ${selectedProducts.length > 0? "bg-red-600 text-white hover:bg-red-700": "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                    onClick={handleSubmit}
                >
                    ĐẶT HÀNG NGAY
                </button>
            </div>
        </div>
    );
}


