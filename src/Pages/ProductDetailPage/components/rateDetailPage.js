import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getProductById } from "../../../services/productService.js";
import { getAllCommentByID } from "../../../services/commentService.js";

export function FrameRate() {
  const { id } = useParams();
  const [productData, setProductData] = useState([]); 
  const [commentDataByID, setCommentDataByID] = useState([]);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await getProductById(id);
        if (!response) {
          throw new Error("Network response was not ok");
        } else {
          setProductData(response);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };
    fetchProductData();
    // fetchComentData();
  }, [id]);

  console.log("00", id);

  useEffect(() => {
    if (productData) {
      fetchComentData();
    }
  }, [productData]);

  const fetchComentData = async () => {
    try {
      const response = await getAllCommentByID(id);
      if (!response) {
        throw new Error("Network response was not ok");
      } else {
        if (response?.status === 200) setCommentDataByID(response.data);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  console.log("123", commentDataByID);

  const ratePercents = ["60%", "31%", "4%", "3%", "2%"];
  const averageRate =
    (parseFloat(ratePercents[0].replace("%", "")) * 5 +
      parseFloat(ratePercents[1].replace("%", "")) * 4 +
      parseFloat(ratePercents[2].replace("%", "")) * 3 +
      parseFloat(ratePercents[3].replace("%", "")) * 2) /
    100;
  const averageRateOn5Scale = averageRate.toFixed(1);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(
          <i
            key={i}
            className="fas fa-star cursor-pointer text-orange-500"
            onClick={() => setRating(i + 1)}
          ></i>
        );
      } else if (i < Math.ceil(rating)) {
        stars.push(
          <i
            key={i}
            className="fas fa-star-half-alt cursor-pointer text-orange-500"
            onClick={() => setRating(i + 0.5)}
          ></i>
        );
      } else {
        stars.push(
          <i
            key={i}
            className="far fa-star cursor-pointer text-orange-500"
            onClick={() => setRating(i + 1)}
          ></i>
        );
      }
    }
    return stars;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComment = { name, rating, comment };
    setCommentsList([...commentsList, newComment]);
    setShowForm(false);
    setName("");
    setPhone("");
    setComment("");
    setRating(0);
  };

  return (
    <div className="max-w-5xl flex flex-col p-12 mx-auto my-10 border border-gray-200 rounded-lg shadow-md bg-white gap-4">
      <div className="w-full h-12 mb-[40px]">
        <h2 className=" font-bold text-[30px]">{productData?.name}</h2>
      </div>
      <div className="max-w-[600px] mx-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[36px] font-bold text-orange-500">
            {averageRateOn5Scale} / 5
          </span>
          <div className="flex gap-1">
            {renderStars(parseFloat(averageRateOn5Scale))}
          </div>
          <span className="text-blue-500 cursor-pointer">
            ( {productData?.totalReviews} đánh giá )
          </span>
        </div>
        {ratePercents.map((percent, index) => (
          <RateItem
            key={index}
            rateNum={5 - index}
            size={{ width: percent }}
            ratePercent={percent}
          />
        ))}
        {showForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowForm(false)}
          ></div>
        )}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold mb-4">
                  Viết đánh giá của bạn
                </h3>
                <div className="flex mb-4">{renderStars(rating)}</div>
                <div className="mb-4">
                  <label className="block mb-1">Tên khách hàng</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Bình luận</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn"
                    required
                    className="w-full p-2 border rounded"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Gửi đánh giá
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div>
        <button
          className="mt-5 px-5 py-4 text-[15px] font-bold text-white bg-blue-600 rounded hover:bg-blue-500"
          onClick={() => setShowForm(true)}
        >
          Viết đánh giá
        </button>
      </div>
      <div className="bg-gray-100 flex flex-col p-5 mt-5 mb-5">
        {commentsList.map((commentItem, index) => (
          <Cmt
            key={index}
            nameCmt={commentItem.name}
            numRate={renderStars(commentItem.rating)}
            textCmt={commentItem.comment}
          />
        ))}
      </div>
    </div>
  );
}

function RateItem({ rateNum, size, ratePercent }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="flex items-center w-10">
        {rateNum} <i className="fas fa-star text-orange-500"></i>
      </span>
      <div className="flex-1 h-2 bg-gray-300 rounded overflow-hidden relative">
        <div
          className="h-full bg-orange-500"
          style={{ width: size.width }}
        ></div>
      </div>
      <span className="w-10 text-right">{ratePercent}</span>
    </div>
  );
}

function Cmt({ nameCmt, numRate, textCmt }) {
  return (
    <div className="bg-gray-200 flex flex-col p-5 mt-5 mb-5 rounded">
      <div className="pb-5 font-bold">{nameCmt}</div>
      <div className="flex pb-5">{numRate}</div>
      <div className="pt-2">
        <p>{textCmt}</p>
      </div>
    </div>
  );
}
