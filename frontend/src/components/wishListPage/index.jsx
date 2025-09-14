import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import slider from "../../../public/imgs/background.png";

import Loading from "../Loading";
import IconLeft from "../../icons/categoryPage/IconLeft";
import IconRight from "../../icons/categoryPage/IconRight";
import HeartIcon from "../../icons/carDetailPage/Heart";
import LikedIcon from "../../icons/carDetailPage/Liked";
import like from "../../../public/imgs/like.png";

import "./style.css";

const WishListPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const nav = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const carsPerPage = 5;
  //
  const [loading, setLoading] = useState(false);
  const [btnLikeProduct, setBtnLikeProduct] = useState(false);
  const crrUser = localStorage.getItem("currentUser");
  const userObj = crrUser ? JSON.parse(crrUser) : null;
  const accessToken = userObj?.accessToken || null;

  const userId = userObj?._id || null;

  if (!accessToken) {
    console.error("AccessToken is missing!");
    message.error("Người dùng chưa đăng nhập");
    nav("/login");
  }
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return;

        const accessToken = user.accessToken;
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/cars/wishlist/${userId}?limit=${carsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setWishlist(response.data.data);
        setTotalPages(response.data.totalPages);

        // Kiểm tra trạng thái like của từng xe
        const likedCars = response.data.data.map((car) => car._id);
        setBtnLikeProduct(likedCars.includes(carId)); // carId là id của xe hiện tại
      } catch (error) {
        console.error("Error fetching wishlist:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [currentPage]);
  /////////////////////////////////////////////////////////

  const handleLikeProduct = async (carId) => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const accessToken = user.accessToken;
      if (!accessToken) {
        alert("Please login to add to wishlist");
        return;
      }

      const isLiked = wishlist.some((car) => car._id === carId);

      if (!isLiked) {
        // Thêm xe vào wishlist
        await axios.post(
          `${API_BASE_URL}/api/v1/cars/${carId}/wishlist/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Cập nhật state wishlist
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/cars/wishlist/${userId}?limit=${carsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setWishlist(response.data.data);
        setBtnLikeProduct(true);
      } else {
        // Xóa xe khỏi wishlist
        await axios.delete(
          `${API_BASE_URL}/api/v1/cars/${carId}/wishlist/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Cập nhật state wishlist
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/cars/wishlist/${userId}?limit=${carsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setWishlist(response.data.data);
        setBtnLikeProduct(false);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error.message);
    }
  };

  ////////////////////////////////////////////////////////
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!wishlist) {
    return <Loading></Loading>;
  }
  return (
    <div className="wishlist">
      <div className="heading">
        <img className="bannerimg" src={slider} alt="" />
        <div className="bannerheading">
          <h1>My Wish List</h1>
        </div>
      </div>

      {/* ////////////////////////////a///////////////////////////////////////////// */}

      {wishlist.length > 0 ? (
        <div className="wishlistIn">
          <h3 className="title">
            Bạn có <span>{wishlist.length}</span> xe yêu thích
          </h3>
          <div className="listCar">
            {wishlist && wishlist.length > 0 ? (
              wishlist.map((car, index) => (
                <div className="CarFrame">
                  <div className="carImg">
                    <img src={car.carImg[0]} alt={car.carName} />
                  </div>
                  <div className="carInfo">
                    <div className="state">{car.state}</div>
                    <div
                      className="nameCar"
                      onClick={() => nav(`/car/${car._id}`)}
                    >
                      {car.carName}
                    </div>
                    <div className="Price">
                      VNĐ:{" "}
                      <span>
                        {car.carPrice ? car.carPrice.toLocaleString() : 0}
                      </span>
                    </div>
                    <div className="BrandAndCountry">
                      {car.brand}, <span>{car.origin}</span>
                    </div>
                    <div className="line"></div>
                    <div className="info">
                      <div
                        className="likeFrame item"
                        onClick={() => handleLikeProduct(car._id)}
                      >
                        {wishlist.some((w) => w._id === car._id) ? (
                          <LikedIcon />
                        ) : (
                          <HeartIcon />
                        )}
                      </div>
                      <div
                        className="toDetailPage"
                        onClick={() => nav(`/car/${car._id}`)}
                      >
                        Chi tiết xe{" "}
                        <IconRight
                          style={{ width: "15", height: "15" }}
                        ></IconRight>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="noneWishlist">
                <p>Hiện tại bạn chưa có chiếc xe yêu thích nào.</p>
                <img src={like} alt="" />
                <p>Hãy thêm những chiếc yêu thích của bạn vào đây nào!</p>
              </div>
            )}
          </div>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IconLeft></IconLeft>
            </button>
            <span>
              Trang {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IconRight></IconRight>
            </button>
          </div>
        </div>
      ) : (
        <div className="noneWishlist">
          <p>Hiện tại bạn chưa có chiếc xe yêu thích nào.</p>
          <img src={like} alt="" />
          <p>Hãy thêm những chiếc yêu thích của bạn vào đây nào!</p>
        </div>
      )}
      {loading && <Loading></Loading>}
    </div>
  );
};

export default WishListPage;
