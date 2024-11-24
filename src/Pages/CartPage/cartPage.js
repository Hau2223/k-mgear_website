import React, { useState, useEffect } from "react";
import { getCartByIdUserStatus, deleteCart } from "../../services/cartService";
import { getProductById } from "../../services/productService";
import { useNavigate } from "react-router-dom";

// import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
export const CartPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const userID = null;
    const [carts, setCarts] = useState([]);
    // Load cart data on component mount
    useEffect(() => {
        const loadCarts = async () => {
            try {
                var cartData = []
                if(userID == null){
                    cartData = JSON.parse(localStorage.getItem("productIDs"))
                }else{
                    cartData = await getCartByIdUserStatus({
                        idUser: userID,
                        status: "cart",
                    });
                    setCarts(cartData)
                }
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
    
        setProducts((prevItems) =>
            prevItems.map((item) => {
    
                if (item._id === id) {
                    const updatedItem = { ...item, quantity: Math.max(1, item.quantity + amount) };
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
            <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">Giỏ hàng</h1>

            <div className="bg-white shadow rounded-lg p-4">
                {products.map((item) => (
                
                <div
                key={item.id}
                className="flex items-center  mb-4 border-b pb-4 relative"
            >
                <input
                    type="checkbox"
                    className="w-5 h-5 mr-4 accent-red-600"
                    checked={selectedProducts.includes(item._id)}
                    onChange={() => toggleProductSelection(item._id)}
                />
                <div className="flex items-center ">
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
                <div className="flex items-center space-x-2 absolute right-0">
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
                    onClick={(()=>{
                        navigate(`/cartInfo`)
                    })}
                >
                    ĐẶT HÀNG NGAY
                </button>
            </div>
        </div>
    );
};




export function CartInfoPage() {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  // Mock vAPI address suggestion function
  const fetchAddressSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    // Simulate API call to vAPI
    const mockData = [
      "123 Main Street, Hanoi",
      "456 Elm Avenue, Ho Chi Minh City",
      "789 Oak Lane, Da Nang",
    ].filter((addr) => addr.toLowerCase().includes(query.toLowerCase()));

    setSuggestions(mockData);
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    fetchAddressSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedAddress(suggestion);
    setAddress(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header Steps */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex-1 text-center">
            <span className="text-red-500 font-bold">Giỏ hàng</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-red-500 font-bold">Thông tin đặt hàng</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-gray-400">Thanh toán</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-gray-400">Hoàn tất</span>
          </div>
        </div>
        <div className="mt-2 border-t border-gray-300"></div>
      </div>

      {/* Customer Info */}
      <form className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Thông tin khách mua hàng</h2>
          <div className="flex items-center space-x-4 mb-4">
            <label>
              <input type="radio" name="gender" value="Anh" className="mr-2" />
              Anh
            </label>
            <label>
              <input type="radio" name="gender" value="Chị" className="mr-2" />
              Chị
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nhập họ tên"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
            />
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
            />
          </div>
        </div>

        {/* Delivery Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Chọn cách nhận hàng</h2>
          <div className="mb-4">
            <label>
              <input
                type="radio"
                name="delivery"
                defaultChecked
                className="mr-2"
              />
              Giao hàng tận nơi
            </label>
          </div>

          {/* Address Input */}
          <div className="mb-4 relative">
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Nhập địa chỉ (vAPI Autocomplete)"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
            />
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border rounded shadow mt-1 w-full max-h-40 overflow-y-auto z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <textarea
            placeholder="Lưu ý, yêu cầu khác (Không bắt buộc)"
            className="w-full border rounded px-3 py-2 mt-4 focus:outline-none focus:ring focus:ring-red-300"
          ></textarea>
          <div className="mt-4">
            <label>
              <input type="checkbox" className="mr-2" />
              Xuất hóa đơn cho đơn hàng
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="text-right mt-6">
          <p className="text-lg">
            Tổng tiền: <span className="font-bold text-red-500">3.380.000đ</span>
          </p>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
          >
            ĐẶT HÀNG NGAY
          </button>
        </div>
      </form>
    </div>
  );
}

