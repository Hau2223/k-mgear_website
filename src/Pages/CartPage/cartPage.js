import React, { useState, useEffect } from "react";
import { getCartByIdUserStatus, deleteCart, updateByIdUserStatus, createCart } from "../../services/cartService";
import { getProductById, updateProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";

const userID = localStorage.getItem("userID");
export function CartPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [carts, setCarts] = useState([]);
    // Load cart data on component mount
    useEffect(() => {
        const loadCarts = async () => {
            try {
                var cartData = [];
                if (userID == null) {
                    cartData = JSON.parse(localStorage.getItem("productIDs"));
                } else {
                    cartData = await getCartByIdUserStatus({
                        idUser: userID,
                        status: "cart",
                    });
                    setCarts(cartData);
                }
                const productData = await Promise.all(
                    cartData.map(async (cart) => {
                        const product = await getProductById(cart.idProduct);
                        if (product.quantity > 0) {
                            return {
                                ...product,
                                quantity: 1,
                            };
                        }
                        return null; 
                    })
                );
                setProducts(productData.filter((product) => product !== null));
            } catch (error) {
                console.error("Error loading cart data:", error);
            }
        };

        loadCarts();
    }, []);

    // Toggle product selection
    const toggleProductSelection = (id) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id) || products.find(e=>e.quantity === 0)
                ? prevSelected.filter((productId) => productId !== id)
                : [...prevSelected, id]
        );
    };

    // Update product quantity
    const updateQuantity = async (id, amount) => {
        var max = (await getProductById(id)).quantity
    
        setProducts((prevItems) =>
            prevItems.map((item) => {
                if (item._id === id) {
                    if(max > item.quantity + amount){
                        max = item.quantity + amount
                    }
                    const updatedItem = {
                        ...item,
                        quantity: Math.max(0, max),
                    };
                    return updatedItem;
                }
                return item; // Return unmodified items
            })
        );
    };

    // Remove product from cart
    const removeItem = async (id) => {
        if (userID) {
            const response = await deleteCart(
                carts.find((cart) => cart.idProduct == id)._id
            );
        } else {
            const data = await JSON.parse(localStorage.getItem("productIDs"));
            const removedData = data.filter((e) => e.idProduct !== id);
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
    function handleSubmit(){
        const selectedPro = products.filter((product)=> selectedProducts.includes(product._id))
        // selectedPro.filter(pro=>pro.quantity === 0)
        localStorage.setItem("selectedProducts",JSON.stringify(selectedPro));
        navigate("/cartInfo");
    }
    return (
        
        <div className="max-w-3xl mx-auto p-6 font-sans">
            <div className="bg-white shadow rounded-lg p-4 border">
                <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
                    Giỏ hàng
                </h1>
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
                                    {(
                                        item.price -
                                        (item.price * item.discount) / 100
                                    ).toLocaleString("vi-VN")}
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
                <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Tổng tiền:</span>
                    <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <button
                    disabled={selectedProducts.length === 0}
                    className={`w-full py-3 rounded-lg mt-4 text-lg font-bold ${selectedProducts.length > 0
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                    onClick={handleSubmit}
                >
                    ĐẶT HÀNG NGAY
                </button>
            </div>
           
        </div>
    );
}


export function CartInfoPage() {
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const [houseNumber, setHouseNumber] = useState(""); // House number
    const [street, setStreet] = useState(""); // Street name
    const [fullAddress, setFullAddress] = useState(""); // Combined full address
    const [other, setOther] = useState("");
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    // Fetch provinces on component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch("https://vapi.vnappmob.com/api/province/");
                const data = await response.json();
                setProvinces(data.results); // Assuming data.result is the array of provinces
            } catch (error) {
                console.error("Failed to fetch provinces:", error);
            }
        };
        const fetchUser = async () =>{
            const user = JSON.parse(localStorage.getItem("user"))
            if(user){
                setSelectedProvince(user.provinceID)
                setSelectedDistrict(user.districtID)
                setSelectedWard(user.wardID)
                setName(user.name)
                setHouseNumber(user.houseNumber)
                setStreet(user.street)
                setPhoneNumber(user.phone)
                setOther(user.other)
                setGender(user.gender)
            }
        }
        fetchProvinces();
        fetchUser()
    }, []);

    // Fetch districts when a province is selected
    useEffect(() => {
        if (!selectedProvince) return;

        const fetchDistricts = async () => {
            try {
                const response = await fetch(
                    `https://vapi.vnappmob.com/api/province/district/${selectedProvince}`
                );
                const data = await response.json();
                setDistricts(data.results);
                setWards([]); // Reset wards when province changes
            } catch (error) {
                console.error("Failed to fetch districts:", error);
            }
        };
        fetchDistricts();
    }, [selectedProvince]);

    // Fetch wards when a district is selected
    useEffect(() => {
        if (!selectedDistrict) return;

        const fetchWards = async () => {
            try {
                const response = await fetch(
                    `https://vapi.vnappmob.com/api/province/ward/${selectedDistrict}`
                );
                const data = await response.json();
                setWards(data.results);
            } catch (error) {
                console.error("Failed to fetch wards:", error);
            }
        };
        fetchWards();
    }, [selectedDistrict]);

    // Combine full address when inputs change
    useEffect(() => {
        var address = "";
        if (houseNumber) {
            address += houseNumber + ", ";
        }
        if (street) {
            address += street + ", ";
        }
        if (selectedWard) {
            address +=
                wards.find((w) => w.ward_id === selectedWard)?.ward_name + ", ";
        }
        if (selectedDistrict) {
            address +=
                districts.find((d) => d.district_id === selectedDistrict)
                    ?.district_name + ", ";
        }
        if (selectedProvince) {
            address += provinces.find(
                (p) => p.province_id === selectedProvince
            )?.province_name;
        }
        setFullAddress(address);
    }, [
        houseNumber,
        street,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        districts,
        wards,
        provinces,
    ]);
    

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        
        // Optional: real-time pattern validation
        const phonePattern = /^[0-9]{10}$/; // Adjust regex as needed for the format
        if (value && !phonePattern.test(value)) {
            setError("Số điện thoại không hợp lệ");
        } else {
            setError("");
        }
    };
    const handleNameChange = (e) =>{
        const value = e.target.value;
        setName(value);
    }
    const handleGenderChange = (e) =>{
        const value = e.target.value;
        setGender(value);
        
    }
    const handleSubmit = (e) => {
        if(!houseNumber || !street || !selectedWard || !selectedDistrict || !selectedProvince || !name || !phoneNumber || !gender){
            return
        }
        const phonePattern = /^[0-9]{10}$/; // Validate on form submission
        if (!phonePattern.test(phoneNumber)) {
            setError("Số điện thoại không hợp lệ");
            alert("Số điện thoại không hợp lệ");
            
            return;
        }
        const user = {
            gender: gender,
            name: name,
            phone: phoneNumber,
            other: other,
            provinceID: selectedProvince,
            districtID: selectedDistrict,
            wardID: selectedWard,
            street: street,
            houseNumber: houseNumber, 
            address: fullAddress
        }
        localStorage.setItem("user",JSON.stringify(user))
        navigate("/cartConf")
    };

    return (
        <div className="max-w-3xl mx-auto p-6 font-sans" >
            <style>
                {`
                    input[type="number"] {
                        appearance: none;
                        -moz-appearance: textfield;
                        -webkit-appearance: none;
                    }

                    input[type="number"]::-webkit-outer-spin-button,
                    input[type="number"]::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                `}
            </style>
        <form className="bg-white shadow rounded-lg p-4 border">
        <button className="flex items-center text-blue-500 hover:underline"
    onClick={()=>{navigate("/cart")}}>
        <span className="mr-1 text-lg">&lt;</span>
        <span>Trở về</span>
      </button>
            <div>
            <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Thông tin mua hàng</h2>
                <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
                <div className="flex items-center space-x-4 mb-4">
                    <label>
                        <input type="radio" name="gender" value="Anh" checked={gender === "Anh"} className="mr-2" onClick={handleGenderChange}/>
                        Anh
                    </label>
                    <label>
                        <input type="radio" name="gender" value="Chị" checked={gender === "Chị"} className="mr-2" onClick={handleGenderChange}/>
                        Chị
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nhập họ tên"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="number"
                        pattern="[0-9]{10}"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="Nhập số điện thoại"
                        className="w-full border rounded px-3 py-2 "
                    />
                    {error && <span className="text-red-500 text-sm">{error}</span>}
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

                {/* Province, District, Ward Select */}
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">
                            Chọn tỉnh/thành phố
                        </label>
                        <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">-- Chọn tỉnh/thành phố --</option>
                            {provinces.map((province) => (
                                <option key={province.province_id} value={province.province_id}>
                                    {province.province_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium">Chọn quận/huyện</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            disabled={!selectedProvince}
                        >
                            <option value="">-- Chọn quận/huyện --</option>
                            {districts.map((district) => (
                                <option key={district.district_id} value={district.district_id}>
                                    {district.district_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium">Chọn phường/xã</label>
                        <select
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            disabled={!selectedDistrict}
                        >
                            <option value="">-- Chọn phường/xã --</option>
                            {wards.map((ward) => (
                                <option key={ward.ward_id} value={ward.ward_id}>
                                    {ward.ward_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <label className="block text-sm font-medium">Tên đường</label>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Nhập tên đường"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full border rounded px-3 py-2 "
                    />
                </div>
                {/* House number and street input */}
                <label className="block text-sm font-medium">Số nhà</label>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Nhập số nhà"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        className="w-full border rounded px-3 py-2 "
                    />
                </div>

                {/* Display Full Address */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Địa chỉ đầy đủ</label>
                    <input
                        type="text"
                        value={fullAddress}
                        readOnly
                        className="w-full border rounded px-3 py-2 focus:outline-none"
                    />
                </div>
                <label className="block text-sm font-medium">Ghi chú</label>
                <textarea
                    placeholder="Lưu ý, yêu cầu khác (Không bắt buộc)"
                    className="w-full border rounded px-3 py-2 mt-4"
                    value={other}
                    onChange={(e)=>{setOther(e.target.value)}}
                ></textarea>

                <div className="mt-6">
                    <div
                        className={`select-none w-full py-3 rounded-lg mt-4 text-lg font-bold text-center ${(houseNumber && street && selectedWard && selectedDistrict && selectedProvince && name && phoneNumber && gender)
                            ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                        onClick={handleSubmit}
                    >
                        Đặt hàng
                    </div>
                </div>
            </div>
        </form>
        </div>
    );
}
export const CartConfirmation = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))
    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts"))
    const totalPrice = selectedProducts
        .reduce(
            (total, item) =>
                total + (item.price - (item.price * item.discount) / 100) * item.quantity, 0
        );
    const handleSubmit = async () => {
        const userID = localStorage.getItem("userID");
        if(userID){
            selectedProducts.map(async (selectedProduct)=>{
                await updateByIdUserStatus({
                    idUser: userID, 
                    idProduct: selectedProduct._id, 
                    amount: selectedProduct.quantity, 
                    oldStatus: "cart",
                    newStatus: "purchased",
                })
                const product =  await getProductById(selectedProduct._id);
                await updateProduct({
                    name: selectedProduct.name,
                    type: selectedProduct.type,
                    price: selectedProduct.price,
                    discount: selectedProduct.discount,
                    quantity: product.quantity - selectedProduct.quantity,
                    brand: selectedProduct.brand,
                    description: selectedProduct.description,
                    rating: selectedProduct.rating,
                    sold: product.sold+selectedProduct.quantity,
                    imageUrl: selectedProduct.imageUrl,
                }, selectedProduct._id)
            })
        }else{
            selectedProducts.map(async (selectedProduct)=>{
                createCart({
                    idUser: "673057eb3241b76f937d432e", 
                    idProduct: selectedProduct._id, 
                    amount: selectedProduct.quantity, 
                    status: "purchased"
                })
                const product =  await getProductById(selectedProduct._id);
                
                await updateProduct({
                    name: selectedProduct.name,
                    type: selectedProduct.type,
                    price: selectedProduct.price,
                    discount: selectedProduct.discount,
                    quantity: product.quantity - selectedProduct.quantity,
                    brand: selectedProduct.brand,
                    description: selectedProduct.description,
                    rating: selectedProduct.rating,
                    sold: product.sold+selectedProduct.quantity,
                    imageUrl: selectedProduct.imageUrl,
                }, selectedProduct._id)
            })
            
        }
        const proIDs = JSON.parse(localStorage.getItem("productIDs"))
        if(proIDs){
            const filteredItems = proIDs.filter(item => !selectedProducts.find(e=>item.idProduct === e._id));
            if(filteredItems.length > 0){
                localStorage.setItem("productIDs",JSON.stringify(filteredItems))
            }else{
                localStorage.removeItem("productIDs")
            }
        }
        localStorage.removeItem("selectedProducts")
        alert("Thanh toán thành công!")
        navigate("/")
    }
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
    <div className="bg-white shadow rounded-lg p-4 border">
    <button className="flex items-center text-blue-500 hover:underline"
    onClick={()=>{navigate("/cartInfo")}}>
        <span className="mr-1 text-lg">&lt;</span>
        <span>Trở về</span>
      </button>
    <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Thanh toán</h2>
      <div className="border-b pb-4 mb-4">
        <h2 className="text-lg mb-2 font-bold">Thông tin đặt hàng</h2>
        <div className="grid gap-y-2">
  <div className="grid grid-cols-[1fr,3fr] text-sm">
    <span className="font-bold">Khách hàng:</span>
    <span>{user.gender+" "+user.name}</span>
  </div>
  <div className="grid grid-cols-[1fr,3fr] text-sm">
    <span className="font-bold">Số điện thoại:</span>
    <span>{user.phone}</span>
  </div>
  <div className="grid grid-cols-[1fr,3fr] text-sm">
    <span className="font-bold">Địa chỉ nhận hàng:</span>
    <span>{user.address}</span>
  </div>
  {user.other ? <div className="grid grid-cols-[1fr,3fr] text-sm">
    <span className="font-bold">Ghi chú:</span>
    <span>{user.other}</span>
  </div>:<></>}
  <div className="grid grid-cols-[1fr,3fr] text-sm font-bold">
    <span className="font-bold">Tổng tiền:</span>
    <span className="text-red-500 font-bold">
      {totalPrice.toLocaleString("vi-VN")}đ
    </span>
  </div>
</div>

      </div>
      <div className="border-t pt-4">
        <h2 className="text-lg font-bold mb-4">Chọn hình thức thanh toán</h2>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="cod"
            name="payment"
            className="w-4 h-4"
            checked
          />
          <label htmlFor="cod" className="text-sm">
            Thanh toán khi giao hàng (COD)
          </label>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Phí vận chuyển:</span>
          <span className="font-bold ">Miễn phí</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Tổng tiền:</span>
          <span className="text-red-500">{totalPrice.toLocaleString("vi-VN")}đ</span>
        </div>
        <button className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 w-full"
        onClick={handleSubmit}>
          THANH TOÁN NGAY
        </button>
      </div>
    </div>
    </div>
  );
};

