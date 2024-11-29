import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
                const response = await 
                fetch("https://vapi.vnappmob.com/api/province/");
                const data = await response.json();
                setProvinces(data.results); 
            } catch (error) {
                console.error("Failed to fetch provinces:", error);
            }
        };
        const fetchUser = async () => {
            const user = JSON.parse(localStorage.getItem("user"))
            if (user) {
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
                setWards([]);
            } catch (error) {
                console.error("Failed to fetch districts:", error);
            }
        };
        fetchDistricts();
    }, [selectedProvince]);
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

        const phonePattern = /^[0-9]{10}$/; 
        if (value && !phonePattern.test(value)) {
            setError("Số điện thoại không hợp lệ");
        } else {
            setError("");
        }
    };
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
    }
    const handleGenderChange = (e) => {
        const value = e.target.value;
        setGender(value);

    }
    const handleSubmit = (e) => {
        if (!houseNumber || !street || !selectedWard || !selectedDistrict 
            || !selectedProvince || !name || !phoneNumber || !gender) {
            return
        }
        const phonePattern = /^[0-9]{10}$/;
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
        localStorage.setItem("user", JSON.stringify(user))
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
                    onClick={() => { navigate("/cart") }}>
                    <span className="mr-1 text-lg">&lt;</span>
                    <span>Trở về</span>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Thông tin mua hàng</h2>
                    <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
                    <div className="flex items-center space-x-4 mb-4">
                        <label>
                            <input type="radio" name="gender" value="Anh" checked={gender === "Anh"} className="mr-2" onClick={handleGenderChange} />
                            Anh
                        </label>
                        <label>
                            <input type="radio" name="gender" value="Chị" checked={gender === "Chị"} className="mr-2" onClick={handleGenderChange} />
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
                        onChange={(e) => { setOther(e.target.value) }}
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
