import React, { useState, useEffect } from "react";
import { getCartByIdUserStatus, deleteCart } from "../../services/cartService";
import { getProductById } from "../../services/productService";
import { useNavigate } from "react-router-dom";
export const CartPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const userID = "6730551bf07941a1390ee637";
    const [carts, setCarts] = useState([]);
    // Load cart data on component mount
    useEffect(() => {
        const loadCarts = async () => {
            try {
                const cartData = await getCartByIdUserStatus({
                    idUser: userID,
                    status: "cart",
                });
                setCarts(cartData)
                
                const productData = await Promise.all(
                    cartData.map(async (cart) => {
                        const product = await getProductById(cart.idProduct);
                        return {
                            ...product,
                            quantity: cart.quantity || 1, // Ensure quantity is set
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

    // Toggle product selection
    const toggleProductSelection = (id) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((productId) => productId !== id)
                : [...prevSelected, id]
        );
    };

    // Update product quantity
    const updateQuantity = (id, amount) => {
        // Log the current products array before modification
        console.log("Products before update:", id);
    
        setProducts((prevItems) =>
            prevItems.map((item) => {
                // Log each product to ensure correct handling
                console.log("Checking item:", item);
    
                if (item._id === id) {
                    const updatedItem = { ...item, quantity: Math.max(1, item.quantity + amount) };
                    console.log("Updating item:", updatedItem); // Log the updated item
                    return updatedItem;
                }
                return item; // Return unmodified items
            })
        );
    };
    

    // Remove product from cart
    const removeItem = async (id) => {
        const response = await deleteCart(carts.find((cart)=>cart.idProduct == id)._id);
        setProducts((prevItems) => prevItems.filter((item) => item._id !== id));
        setSelectedProducts((prevSelected) =>
            prevSelected.filter((productId) => productId !== id)
        );
    };

    // Calculate total price for selected products
    const totalPrice = products
        .filter((item) => selectedProducts.includes(item._id))
        .reduce((total, item) => total + (item.price - (item.price*item.discount/100)) * item.quantity, 0);

    return (
        <div className="max-w-3xl mx-auto p-6 font-sans">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Giỏ hàng</h1>

            <div className="bg-white shadow rounded-lg p-4">
                {products.map((item) => (
                
                <div
                key={item.id}
                className="flex items-center justify-between mb-4 border-b pb-4"
            >
                <input
                    type="checkbox"
                    className="w-5 h-5 mr-4 accent-red-600"
                    checked={selectedProducts.includes(item._id)}
                    onChange={() => toggleProductSelection(item._id)}
                />
                <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                        <img
                            src={item.imageUrl || "https://via.placeholder.com/80"}
                            alt={item.name}
                            className="w-28 h-28 object-cover rounded-lg"
                        />
                        <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-500 text-sm mt-2 hover:underline"
                        >
                            Xóa
                        </button>
                    </div>
            
                    <div className="flex flex-col flex-1">
                        <h2
                            className="text-lg font-medium cursor-pointer"
                            onClick={() => navigate(`/product/${item._id}`)}
                        >
                            {item.name}
                        </h2>
                        <p className="text-sm text-gray-500 line-through">
                {item.price.toLocaleString("vi-VN") + "đ"}
            </p>
            <p className="text-red-600 font-semibold text-lg">
                {(item.price - (item.price * item.discount) / 100).toLocaleString(
                    "vi-VN"
                )}
                đ
            </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-8 h-8 bg-gray-200 rounded text-lg font-bold text-gray-700 flex items-center justify-center"
                    >
                        -
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-8 h-8 bg-gray-200 rounded text-lg font-bold text-gray-700 flex items-center justify-center"
                    >
                        +
                    </button>
                </div>
            </div>
            
                ))}
            </div>

            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Tổng tiền:</span>
                    <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <button
                    disabled={selectedProducts.length === 0}
                    className={`w-full py-3 rounded-lg mt-4 text-lg font-bold ${
                        selectedProducts.length > 0
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                >
                    ĐẶT HÀNG NGAY
                </button>
            </div>
        </div>
    );
};
