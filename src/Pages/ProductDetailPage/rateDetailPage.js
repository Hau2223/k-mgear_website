import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getProductById, updateProduct } from "../../services/productService";
import {
  getAllCommentByID,
  createComment,
  deleteComment,
} from "../../services/commentService.js";
import { FaTrashAlt } from "react-icons/fa";
import { GrTestDesktop } from "react-icons/gr";

export function FrameRate() {
  const { id } = useParams();
  const [productData, setProductData] = useState([]); // Default to null
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

  const r1 = commentDataByID.filter((item) => item.rating === 1).length;
  const r2 = commentDataByID.filter((item) => item.rating === 2).length;
  const r3 = commentDataByID.filter((item) => item.rating === 3).length;
  const r4 = commentDataByID.filter((item) => item.rating === 4).length;
  const r5 = commentDataByID.filter((item) => item.rating === 5).length;

  const ttRate = r1 + r2 + r3 + r4 + r5;

  const ratePercentss = [
    (r5 / ttRate) * 100,
    (r4 / ttRate) * 100,
    (r3 / ttRate) * 100,
    (r2 / ttRate) * 100,
    (r1 / ttRate) * 100,
  ];

  console.log("tt", ratePercentss);

  const averageRate =
    (parseFloat(ratePercentss[0]) * 5 +
      parseFloat(ratePercentss[1]) * 4 +
      parseFloat(ratePercentss[2]) * 3 +
      parseFloat(ratePercentss[3]) * 2) /
    100;

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(
          <i
            key={i}
            className="fas fa-star cursor-pointer text-orange-500 text-xl"
            onClick={() => setRating(i + 1)}
          ></i>
        );
      } else if (i < Math.ceil(rating)) {
        stars.push(
          <i
            key={i}
            className="fas fa-star-half-alt cursor-pointer text-orange-500 text-xl"
            onClick={() => setRating(i + 0.5)}
          ></i>
        );
      } else {
        stars.push(
          <i
            key={i}
            className="far fa-star cursor-pointer text-orange-500 text-xl"
            onClick={() => setRating(i + 1)}
          ></i>
        );
      }
    }
    return stars;
  };

  const averageRateOn5Scale = averageRate ? parseFloat(averageRate).toFixed(1) : "0";
  const totalRate = commentDataByID.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idProduct = id;
    const idUser = "6730551bf07941a1390ee637";

    if (!idUser) return;
    const newComment = {
      idUser: idUser,
      idProduct: idProduct,
      comment: comment,
      rating: rating,
      nameUser: name,
    };

    try {
      const response = await createComment(newComment);

      if (response?.status === 200) {
        console.log("Comment created successfully:", response.data);

        setCommentDataByID((prevComments) => [
          ...prevComments,
          {
            ...newComment,
            datetime: new Date().toISOString(),
          },
        ]);

        const totalRatingValue = commentDataByID.length + 1;
          
        const updateResponse = await updateProduct(
          {
            rating: averageRate.toFixed(1),
            totalReviews: totalRatingValue,
          },
          idProduct
        );

        if (updateResponse?.status === 200) {
          console.log("Product updated successfully:", updateResponse.data);

          setProductData((prevData) => ({
            ...prevData,
            rating: averageRate,
          }));
        }
      } else {
        throw new Error(response.message || "Unknown error");
      }
    } catch (error) {
      console.error(
        "Error creating comment or updating product:",
        error.message
      );
    }

    setShowForm(false);
    setName("");
    setPhone("");
    setComment("");
    setRating(0);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);

      if (response?.status === 200) {
        console.log("Comment deleted successfully");

        // Cập nhật lại danh sách bình luận sau khi xóa
        setCommentDataByID((prevComments) => {
          const updatedComments = prevComments.filter(
            (comment) => comment._id !== commentId
          );

          // Tính lại các đánh giá sau khi xóa bình luận
          const r1 = updatedComments.filter((item) => item.rating === 1).length;
          const r2 = updatedComments.filter((item) => item.rating === 2).length;
          const r3 = updatedComments.filter((item) => item.rating === 3).length;
          const r4 = updatedComments.filter((item) => item.rating === 4).length;
          const r5 = updatedComments.filter((item) => item.rating === 5).length;
          const ttRate = r1 + r2 + r3 + r4 + r5;

          const ratePercentss = [
            (r5 / ttRate) * 100,
            (r4 / ttRate) * 100,
            (r3 / ttRate) * 100,
            (r2 / ttRate) * 100,
            (r1 / ttRate) * 100,
          ];

          const averageRate =
            (parseFloat(ratePercentss[0]) * 5 +
              parseFloat(ratePercentss[1]) * 4 +
              parseFloat(ratePercentss[2]) * 3 +
              parseFloat(ratePercentss[3]) * 2) /
            100;

          const averageRateOn5Scale = averageRate
            ? parseFloat(averageRate).toFixed(1)
            : "0";

          // Cập nhật lại giá trị mới
          setProductData((prevData) => ({
            ...prevData,
            rating: averageRateOn5Scale, // Cập nhật lại rating
          }));

          return updatedComments;
        });
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };


  return (
    <div className="max-w-5xl flex flex-col p-12 mx-auto my-10 border border-gray-200 rounded-lg shadow-md bg-white gap-4">
      <div className="w-full h-12 mb-[20px]">
        <h2 className=" font-bold text-[26px]">Đánh giá và bình luận</h2>
      </div>
      <div className="max-w-[600px] mx-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[36px] font-bold text-orange-500">
            {averageRateOn5Scale} / 5
          </span>
          <div className="flex gap-1 ">
            {renderStars(parseFloat(averageRateOn5Scale))}
          </div>
          <span className="text-blue-500 cursor-pointer">
            ( {totalRate} đánh giá )
          </span>
        </div>
        {ratePercentss.map((percent, index) => {
          const validPercent = percent ?? 0;
          <RateItem
            key={index}
            rateNum={5 - index}
            size={{ width: validPercent }}
            ratePercent={percent}
          />;
        })}
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
                <h3 className="text-2xl font-bold mb-4">
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
                    pattern="\d+"
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
                  />
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
        {commentDataByID?.map((commentItem, index) => (
          <Cmt
            commentId={commentItem._id}
            key={index}
            nameCmt={commentItem.nameUser}
            numRate={renderStars(commentItem.rating)}
            textCmt={commentItem.comment}
            onDelete={handleDeleteComment}
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

function Cmt({ commentId, nameCmt, numRate, textCmt, onDelete }) {
  return (
    <div className="bg-gray-200 flex flex-col p-5 mt-5 mb-5 rounded relative">
      <div className="pb-5 font-bold text-xl">{nameCmt}</div>
      <div className="flex pb-5">{numRate}</div>
      <div className="pt-2">
        <p>{textCmt}</p>
      </div>
      <button
        className="absolute top-2 right-2 text-red-500"
        onClick={() => onDelete(commentId)}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
}
