import React from "react";
import { updateByIdUserStatus, createCart } from "../../../services/cartService";
import { getProductById, updateProduct } from "../../../services/productService";
import { useNavigate } from "react-router-dom";

export const CartConfirmation = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))
    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts"))
    const userID = localStorage.getItem("userID");
    const totalPrice = selectedProducts
        .reduce(
            (total, item) =>
                total + (item.price - (item.price * item.discount) / 100) * item.quantity, 0
        );
    const handleSubmit = async () => {
        selectedProducts.map(async (selectedProduct) => {
            if (userID) {
                selectedProducts.map(async (selectedProduct) => {
                    await updateByIdUserStatus({
                        idUser: userID,
                        idProduct: selectedProduct._id,
                        amount: selectedProduct.quantity,
                        oldStatus: "cart",
                        newStatus: "purchased",
                    })
                })
            }else{
                selectedProducts.map(async (selectedProduct) => {
                    createCart({
                        idUser: "673057eb3241b76f937d432e",
                        idProduct: selectedProduct._id,
                        amount: selectedProduct.quantity,
                        status: "purchased"
                    })
                })
            }
            const product = await getProductById(selectedProduct._id);
            await updateProduct({
                name: selectedProduct.name,
                type: selectedProduct.type,
                price: selectedProduct.price,
                discount: selectedProduct.discount,
                quantity: product.quantity - selectedProduct.quantity,
                brand: selectedProduct.brand,
                description: selectedProduct.description,
                rating: selectedProduct.rating,
                sold: product.sold + selectedProduct.quantity,
                imageUrl: selectedProduct.imageUrl,
            }, selectedProduct._id)
        })
        const proIDs = JSON.parse(localStorage.getItem("productIDs"))
        if (proIDs) {
            const filteredItems = proIDs.filter(
                item => !selectedProducts.find(e => item === e._id));
            if (filteredItems.length > 0) {
                localStorage.setItem("productIDs", JSON.stringify(filteredItems))
            } else {
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
                    onClick={() => { navigate("/cartInfo") }}>
                    <span className="mr-1 text-lg">&lt;</span>
                    <span>Trở về</span>
                </button>
                <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Thanh toán</h2>
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-lg mb-2 font-bold">Thông tin đặt hàng</h2>
                    <div className="grid gap-y-2">
                        <div className="grid grid-cols-[1fr,3fr] text-sm">
                            <span className="font-bold">Khách hàng:</span>
                            <span>{user.gender + " " + user.name}</span>
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
                        </div> : <></>}
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
