import React, { useState, useEffect, useCallback } from "react";
import {
  getAll,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { useNavigate, useLocation } from "react-router-dom";
import { IMAGES } from "../../utils/constants";
import {
  HiDotsHorizontal,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { FaCaretDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export function ProductManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [productAll, setProductAll] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [fileSelected, setFileSelected] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]); // Giá mặc định
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const productTypes = ["Bàn phím", "Chuột", "Màn hình", "Tài Nghe", "Khác"];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownTypeOpen, setIsDropdownTypeOpen] = useState(false);
  const [isDropdownBrandOpen, setIsDropdownBrandOpen] = useState(false);

  const [filter, setFilter] = useState({
    type: "",
    brand: "",
    maxPrice: "",
  });

  const [activePopup, setActivePopup] = useState(null);
  const [data, setData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    discount: "",
    quantity: "",
    imageUrl: "",
    brand: "",
    typeImage: "",
  });

  useEffect(() => {
    fetchAllProduct();
  }, [location.pathname]);

  useEffect(() => {
    applyFilter();
  }, [filter, productAll]);

  const fetchAllProduct = async () => {
    try {
      const response = await getAll();
      if (!response) {
        throw new Error("Network response was not ok");
      } else {
        setProductAll(response);
        setFilteredProducts(response);
        setIsLoading(false);
        const prices = response.map((product) => product.price);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      setIsLoading(true);
    }
  };

  const applyFilter = () => {
    let result = productAll;

    if (filter.name) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter.type) {
      result = result.filter((product) =>
        product.type.toLowerCase().includes(filter.type.toLowerCase())
      );
    }

    if (filter.brand) {
      result = result.filter((product) =>
        product.brand.toLowerCase().includes(filter.brand.toLowerCase())
      );
    }

    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Other filter conditions...

    setFilteredProducts(result);
  };

  const handleAddProduct = useCallback(
    async (e) => {
      e.preventDefault(); // Prevent default form submission
      if (
        !data.name ||
        !data.type ||
        !data.price ||
        !data.quantity ||
        !data.brand
      ) {
        alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
        return;
      }
      if (!fileSelected) {
        alert("Vui lòng chọn file ảnh trước khi gửi.");
        return;
      }

      try {
        const res = await createProduct(data);
        // console.log("Add product successfully!!!", res);
        if (res?.status === 200) {
          setIsModalOpen(false);
          await fetchAllProduct();
          setData({
            name: "",
            type: "",
            price: "",
            description: "",
            discount: "",
            quantity: "",
            imageUrl: "",
            brand: "",
            typeImage: "",
          });
          alert("Thêm sản phẩm thành công!!!");
        }
      } catch (err) {
        console.error("Add product failed!", err);
        alert(
          "thêm sản phẩm lỗi: " + err.response?.data?.message || err.message
        );
      }
    },
    [data, fileSelected]
  );

  const handleUpdateProduct = useCallback(
    async (e) => {
      e.preventDefault(); // Prevent default form submission
      if (!fileSelected) {
        alert("Vui lòng chọn file ảnh trước khi gửi."); // Alert if no file is selected
        return;
      }
      try {
        const res = await updateProduct(selectedProduct, selectedProduct._id);
        // console.log(selectedProduct, "id",selectedProduct._id);
        // console.log("Update product successfully!!!", res);
        if (res?.status === 200) {
          setIsModalOpenUpdate(false);
          await fetchAllProduct();
          await setActivePopup(null);

          alert("Thông Báo:\nCập nhật sản phẩm thành công");
        }
      } catch (err) {
        console.error("Updated product failed!", err);
        alert(
          "Error Updated product: " + err.response?.data?.message || err.message
        );
      }

      // Handle your update logic here
    },
    [selectedProduct, fileSelected]
  );

  const handleDeleteProduct = async (productId) => {
    console.log("Delete product:", productId);
    try {
      const res = await deleteProduct(productId);
      if (res?.status === 200) {
        setIsModalOpenUpdate(false);
        await fetchAllProduct();
        await setActivePopup(null);
        // console.log("Delete product successfully!!!");
        alert("Thông Báo:\nXóa sản phẩm thành công");
      }
    } catch (err) {
      console.error("Deleted product failed!", err);
      alert(
        "Error Deleted product: " + err.response?.data?.message || err.message
      );
    }
  };

  // const handleEdit = (productId) => {
  //   console.log("Edit product:", productId._id, "name", productId.name);
  // };
  // console.log(selectedProduct);

  const togglePopup = (productId) => {
    setActivePopup(activePopup === productId ? null : productId);
    setIsDropdownTypeOpen(false);
    setIsDropdownVisible(false);
    setIsDropdownBrandOpen(false);
  };

  const handleTextChange = (type, text) => {
    switch (type) {
      case "name":
        setData((c) => ({ ...c, name: text }));
        break;
      case "type":
        setData((c) => ({ ...c, type: text }));
        break;
      case "price":
        setData((c) => ({ ...c, price: text }));
        break;
      case "description":
        setData((c) => ({ ...c, description: text })); // Corrected spelling
        break;
      case "discount":
        setData((c) => ({ ...c, discount: text }));
        break;
      case "quantity":
        setData((c) => ({ ...c, quantity: text }));
        break;
      case "imageUrl":
        setData((c) => ({ ...c, imageUrl: text }));
        break;
      case "brand":
        setData((c) => ({ ...c, brand: text }));
        break;
      case "typeImage":
        setData((c) => ({ ...c, typeImage: text }));
    }
  };

  const handleTextChangeUpdate = (type, text) => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [type]: text,
    }));
  };

  const handleSingleSelect = (selectedType) => {
    setData((prevData) => ({
      ...prevData,
      type: selectedType,
    }));
    setIsDropdownOpen(false);
  };
  const getUniqueTypes = (products) => {
    const types = products.map((product) => product.type);
    return [...new Set(types)];
  };

  const getUniqueBrands = (products) => {
    const brands = products.map((product) => product.brand);
    return [...new Set(brands)];
  };

  const uniqueProductTypes = getUniqueTypes(productAll);
  const uniqueProductBrands = getUniqueBrands(productAll);

  const handleTypeFilterChange = (selectedType) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      type: selectedType, // Set to empty string for "Tất cả"
    }));
    setIsDropdownTypeOpen(false);
  };
  const handleBrandFilterChange = (selectedBrand) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      brand: selectedBrand,
    }));
    setIsDropdownBrandOpen(false); // Close the dropdown after selection
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleImageUpload = async (e, context) => {
    const file = e.target.files[0];
    setFileSelected(!!file); // Set to true if a file is selected, false otherwise

    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const maxWidth = 200; // Max width
            const maxHeight = 200; // Max height
            let width = img.width;
            let height = img.height;

            // Calculate resize ratio
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = width * ratio;
              height = height * ratio;
            }

            // Create canvas and draw image
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to base64 URL
            const resizedBase64 = canvas.toDataURL(file.type);

            // Depending on the context, set the appropriate state
            if (context === "add") {
              handleTextChange("imageUrl", resizedBase64.split(",")[1]);
              handleTextChange("typeImage", file.type);
            } else if (context === "update") {
              handleTextChangeUpdate("imageUrl", resizedBase64.split(",")[1]);
              handleTextChangeUpdate("typeImage", file.type);
            }
          };

          img.src = reader.result;
        };
        reader.readAsDataURL(file); // Read file as base64
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="m-3 w-full">
      <h1 className="text-3xl font-bold text-center text-red-500">
        Quản lý sản phẩm
      </h1>
      <div className="flex items-center mb-6 gap-5 mt-3 ml-3">
        <div className="flex items-center">
          <span>Tìm kiếm: </span>
          <div className="flex items-center border rounded bg-white focus-within:border-teal-500">
            <input
              type="text"
              placeholder="Nhập tên sản phẩm"
              className="border-none focus:outline-none p-2 ml-1"
              value={filter.name}
              onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            />
            <FaSearch className="mr-2" />
          </div>
        </div>

        <div className="relative ">
          <button
            className=" flex items-center justify-center gap-1  p-2 border border-teal-500
            rounded cursor-pointer min-w-32 hover:bg-gray-200 text-black font-medium"
            onClick={() => {
              setIsDropdownTypeOpen(!isDropdownTypeOpen);
              setIsDropdownVisible(false);
              setIsDropdownBrandOpen(false);
              setActivePopup(null);
            }}
          >
            {filter.type || "Loại Sản phẩm"}
            <FaCaretDown className="" />
          </button>
          {isDropdownTypeOpen && (
            <div className="absolute grid grid-cols-3 z-10 p-1 bg-white shadow-lg rounded w-[400px] border border-gray-300">
              <div
                className={`flex items-center justify-center p-2 cursor-pointer min-w-32 ${
                  filter.type === ""
                    ? "border border-teal-400 rounded"
                    : "hover:border hover:border-teal-400 hover:rounded"
                }`}
                onClick={() => handleTypeFilterChange("")} // Reset filter to show all products
              >
                Tất cả
              </div>
              {uniqueProductTypes.map((type, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center p-2 cursor-pointer min-w-32 ${
                    filter.type === type
                      ? "border border-teal-400 rounded"
                      : "hover:border hover:border-teal-400 hover:rounded"
                  }`}
                  onClick={() => handleTypeFilterChange(type)}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="flex items-center justify-center gap-1 p-2 border border-teal-500 rounded cursor-pointer min-w-26 hover:bg-gray-200 text-black font-medium"
            onClick={() => {
              setIsDropdownBrandOpen(!isDropdownBrandOpen);
              setIsDropdownTypeOpen(false);
              setIsDropdownVisible(false);
              setActivePopup(null);
            }}
          >
            {filter.brand || "Hãng"}
            <FaCaretDown />
          </button>
          {isDropdownBrandOpen && (
            <div className="absolute grid grid-cols-3 z-10 p-1 bg-white shadow-lg rounded w-[400px] border border-gray-300 gap-2">
              <div
                className={`flex items-center justify-center p-2 cursor-pointer min-w-26 ${
                  filter.brand === ""
                    ? "border border-teal-400 rounded"
                    : "hover:border hover:border-teal-400 hover:rounded"
                }`}
                onClick={() => handleBrandFilterChange("")}
              >
                Tất cả
              </div>
              {uniqueProductBrands.map((brand, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center p-2 cursor-pointer min-w-26 ${
                    filter.brand === brand
                      ? "border border-teal-400 rounded"
                      : "hover:border hover:border-teal-400 hover:rounded"
                  }`}
                  onClick={() => handleBrandFilterChange(brand)}
                >
                  {brand}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative items-center">
          <button
            className="flex items-center justify-center gap-1  p-2 border border-teal-500
            rounded cursor-pointer min-w-20 hover:bg-gray-200 text-black font-medium"
            onClick={() => {
              setIsDropdownVisible(!isDropdownVisible);
              setIsDropdownTypeOpen(false);
              setIsDropdownBrandOpen(false);
              setActivePopup(null);
            }} // Hiện/ẩn dropdown
          >
            Giá
            <FaCaretDown className="" />
          </button>

          {isDropdownVisible && (
            <div className="absolute z-10 bg-white shadow-lg rounded w-[400px] p-5 border border-gray-300">
              <Slider
                range
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={setPriceRange}
                step={10000} // Bước nhảy
                railStyle={{ backgroundColor: "border-gray-300" }} // Màu nền
                handleStyle={[
                  { borderColor: "green", backgroundColor: "green" },
                  { borderColor: "green", backgroundColor: "green" },
                ]} // Màu nút
              />
              <div className="flex justify-between">
                <span>{priceRange[0].toLocaleString()} VNĐ</span>
                <span>{priceRange[1].toLocaleString()} VNĐ</span>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => {
                  applyFilter(); // Gọi hàm lọc
                  setIsDropdownVisible(false); // Ẩn dropdown
                }}
              >
                Xem kết quả
              </button>
            </div>
          )}
        </div>

        <button
          className="bg-green-500 text-white px-4 py-2 w-36 rounded shadow hover:shadow-lg absolute right-5"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 p-2 justify-center">
        {isloading ? (
          filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="relative border rounded-lg p-4 pt-10 shadow bg hover:shadow-lg"
              >
                {/* Nút ba chấm */}
                <button
                  onClick={() => togglePopup(product._id)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 pointer-events-auto"
                >
                  <HiDotsHorizontal />
                </button>
                {activePopup === product._id && (
                  <div className="absolute top-8 right-2 bg-white shadow-lg border rounded-md w-35 z-10">
                    {/* Edit button */}
                    <button
                      onClick={() => {
                        setIsModalOpenUpdate(true);
                        setSelectedProduct(product);
                      }}
                      className="block w-full px-4 py-2 text-left text-yellow-400 font-semibold  hover:bg-gray-200 flex items-center"
                    >
                      <HiOutlinePencil className="mr-2 " />
                      Cập nhật
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="block w-full px-4 py-2 text-left text-red-500 font-semibold hover:bg-gray-200 flex items-center"
                    >
                      <HiOutlineTrash className="mr-2" />
                      Xóa
                    </button>
                  </div>
                )}

                <img
                  src={product?.imageUrl || IMAGES.PART}
                  onError={(e) => (e.target.src = IMAGES.PART)}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-4"
                />
                <h2 className="font-semibold text-lg text-ellipsis line-clamp-2">
                  {product.name}
                </h2>
                <p>Loại: {product.type}</p>
                <p className="text-ellipsis line-clamp-1 ">
                  Giá: {product.price.toLocaleString()} VNĐ
                </p>
                <p>Giảm giá: {product.discount}%</p>
              </div>
            ))
          ) : (
            <div className="text-center col-span-5">
              <p className="text-xl font-semibold text-gray-600">
                Không có sản phẩm nào tương tự
              </p>
            </div>
          )
        ) : (
          <div className="text-center col-span-5">
            <p className="text-xl font-semibold text-gray-600">
              Đang tải sản phẩm...
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-3 rounded shadow-lg w-2/4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Thêm sản phẩm mới</h2>
            {/* Form thêm sản phẩm */}
            <form>
              <div className="mb-4">
                <label className="block font-medium">Tên sản phẩm:</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập tên sản phẩm"
                  value={data.name}
                  required={true}
                  onChange={(e) => handleTextChange("name", e.target.value)}
                />
              </div>
              <div className="mb-4 relative">
                <label className="block font-medium">Loại sản phẩm:</label>
                <div
                  className="border p-2 w-full rounded cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {data.type || "Chọn loại sản phẩm"}
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 bg-white border shadow-lg w-full mt-1 rounded">
                    {productTypes.map((type, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSingleSelect(type)} // Gọi hàm xử lý chọn một mục
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block font-medium">Mô tả:</label>
                <input
                  value={data.description}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập mô tả sản phẩm"
                  onChange={(e) =>
                    handleTextChange("description", e.target.value)
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Giảm giá:</label>
                <input
                  value={data.discount}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập loại sản phẩm"
                  onChange={(e) => handleTextChange("discount", e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Số lượng:</label>
                <input
                  value={data.quantity}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập giảm giá sản phẩm"
                  required={true}
                  onChange={(e) => handleTextChange("quantity", e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Hình ảnh:</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border p-2 w-full rounded"
                  required={true}
                  onChange={(e) => handleImageUpload(e, "add")} // Handle image upload
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium">Hãng:</label>
                <input
                  value={data.brand}
                  required={true}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập hãng"
                  onChange={(e) => handleTextChange("brand", e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium">Giá:</label>
                <input
                  value={data.price}
                  required={true}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập giá sản phẩm"
                  onChange={(e) => handleTextChange("price", e.target.value)}
                />
              </div>

              {/* Các nút hành động */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setIsModalOpen(false);
                    setActivePopup(null);
                  }} // Đóng modal
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleAddProduct}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpenUpdate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
          onClick={() => setIsModalOpenUpdate(false)}
        >
          <div
            className="bg-white p-3 rounded shadow-lg w-2/4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Cập nhật sản phẩm</h2>
            {/* Form thêm sản phẩm */}
            <form>
              <div className="mb-4">
                <label className="block font-medium">Tên sản phẩm:</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập tên sản phẩm"
                  value={selectedProduct?.name}
                  onChange={(e) =>
                    handleTextChangeUpdate("name", e.target.value)
                  }
                />
              </div>

              <div className="mb-4 relative">
                <label className="block font-medium">Loại sản phẩm:</label>
                <div
                  className="border p-2 w-full rounded cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedProduct.type || "Chọn loại sản phẩm"}
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 bg-white border shadow-lg w-full mt-1 rounded">
                    {productTypes.map((type, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSingleSelect(type)} // Gọi hàm xử lý chọn một mục
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block font-medium">Mô tả:</label>
                <input
                  value={selectedProduct.description}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập mô tả sản phẩm"
                  onChange={(e) =>
                    handleTextChangeUpdate("description", e.target.value)
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Giảm giá:</label>
                <input
                  value={selectedProduct.discount}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập loại sản phẩm"
                  onChange={(e) =>
                    handleTextChangeUpdate("discount", e.target.value)
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Số lượng:</label>
                <input
                  value={selectedProduct.quantity}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập giảm giá sản phẩm"
                  onChange={(e) =>
                    handleTextChangeUpdate("quantity", e.target.value)
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Hình ảnh:</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border p-2 w-full rounded"
                  onChange={(e) => handleImageUpload(e, "update")} // Handle image upload
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium">Hãng:</label>
                <input
                  value={selectedProduct.brand}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập hãng"
                  onChange={(e) =>
                    handleTextChangeUpdate("brand", e.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium">Giá:</label>
                <input
                  value={selectedProduct.price}
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Nhập giá sản phẩm"
                  onChange={(e) =>
                    handleTextChangeUpdate("price", e.target.value)
                  }
                />
              </div>
              {/* Các nút hành động */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setIsModalOpenUpdate(false);
                    setActivePopup(null);
                  }} // Đóng modal
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleUpdateProduct}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
