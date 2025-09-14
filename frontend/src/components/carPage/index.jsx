//Icon
import NextBtnIcon from "../../icons/carDetailPage/nextBtnIcon";
import PreviousBtnIcon from "../../icons/carDetailPage/previousBtnIcon";
import ShareIcon from "../../icons/carDetailPage/shareIcon";
import HeartIcon from "../../icons/carDetailPage/Heart";
import LikedIcon from "../../icons/carDetailPage/Liked";
//react
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
//loading
import Loading from "../Loading";
//
import { Store } from "../../Store";
//css
import "./style.css";
const CarDetailPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const store = useContext(Store);
  const navigate = useNavigate();
  const [crrImg, setCrrImg] = useState(0); //hình ảnh to (ảnh hiện tại)
  const [btnLikeProduct, setBtnLikeProduct] = useState(false);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(false);
  //dữ liệu xe
  const { idCar } = useParams();
  const [carData, setCarData] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  //
  let accessToken;
  let userId;
  let role;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
    userId = store.currentUser._id;
    role = store.currentUser.role;
  }
  // const crrUser = localStorage.getItem("currentUser");
  // const userObj = crrUser ? JSON.parse(crrUser) : null;
  // const accessToken = userObj?.accessToken || null;
  // const userId = userObj?._id || null;
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (status === "pending" && role !== "ADMIN") {
      navigate("/");
    }
  });

  //Hàm gửi thư
  const handleSendMail = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("senderName", userName);
    formData.append("senderEmail", email);
    formData.append("senderPhone", phoneNumber);
    formData.append("mailContent", comment);
    console.log(formData);
    try {
      if (!accessToken) {
        message.error("Người dùng chưa đăng nhập");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/mail/PostMail?senderId=${userId}&recipientId=${carData.idProvider._id}&carId=${carData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success(response.data.message);
    } catch (error) {
      console.error("Lỗi gửi thư:", error.message);
      if (error.response && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };
  //lấy thông tin xe

  // const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    // const accessToken = user.accessToken;

    const fetchCarData = async () => {
      try {
        const carResponse = await axios.get(
          `${API_BASE_URL}/api/v1/cars/car/${idCar}`
        );
        setCarData(carResponse.data.data);
        setStatus(carResponse.data.data.isStatus);

        const wishListResponse = await axios.get(
          `${API_BASE_URL}/api/v1/cars/wishlist/${user._id}?limit=100&page=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // setWishlist(wishListResponse.data.data);

        wishListResponse.data.data.forEach((w) => {
          console.log(idCar);
          if (w._id == idCar) {
            setBtnLikeProduct(true);
          }
        });
      } catch (error) {
        console.error("Error fetching car data:", error.message);
      }
    };
    fetchCarData();
  }, [idCar]);

  const listImgRv = carData?.carImg;

  //hàm chuyển ảnh
  const nextRVImg = () => {
    setCrrImg((prev) => (prev - 1 + listImgRv.length) % listImgRv.length);
  };

  const previousRVImg = () => {
    setCrrImg((prev) => (prev + 1) % listImgRv.length);
  };
  // hàm thích sản phẩm (chưa kết hợp api để lưu - mới là ảnh động)

  const handleLikeProduct = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const accessToken = user.accessToken;
      if (!accessToken) {
        alert("Please login to add to wishlist");
        return;
      }

      if (!btnLikeProduct) {
        await axios
          .post(`${API_BASE_URL}/api/v1/cars/${idCar}/wishlist/${user._id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log(response);
          });

        setBtnLikeProduct(true);
      } else {
        await axios
          .delete(`${API_BASE_URL}/api/v1/cars/${idCar}/wishlist/${user._id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log(response);
          });
        setBtnLikeProduct(false);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error.message);
    }
  };

  if (!carData) {
    return <Loading></Loading>;
  }

  const handleCopy = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        message.success("Đã sao chép đường dẫn!", 2);
      })
      .catch((err) => {
        message.error("Không thể sao chép đường dẫn: ", err);
      });
  };

  return (
    <div className="CarDetailPage">
      <div className="frame0">
        <h1 className="nameCar">
          {carData.carName} <span>({carData.state})</span>
        </h1>
        <div className="brand">- {carData.brand} -</div>
      </div>
      <div className="imgReviewCar Frame1">
        <div className="mainImgRV">
          <img src={listImgRv[crrImg]} alt="Car Detail" />
          <div className="changeImgFrame">
            <button className="nextImgRv" onClick={nextRVImg}>
              <NextBtnIcon />
            </button>
            <button className="previousImgRv" onClick={previousRVImg}>
              <PreviousBtnIcon />
            </button>
          </div>
        </div>
        <div className="listImgRV">
          {listImgRv.map((img, index) => (
            <div
              key={index}
              className={`item ${crrImg === index ? "active" : ""}`}
              onClick={() => setCrrImg(index)}
            >
              <img src={img} alt={`Car Detail ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="Frame2 allCarInformation">
        <div className="frameLeft">
          <div className="section1 loveAndShareFrame">
            <div className="likeFrame item" onClick={handleLikeProduct}>
              {!btnLikeProduct ? <HeartIcon /> : <LikedIcon />}

              <div className="text">Yêu thích</div>
            </div>
            <div className="line"></div>
            <div className="shareFrame item" onClick={handleCopy}>
              <ShareIcon></ShareIcon>
              <div className="text">Chia sẻ</div>
            </div>
          </div>
          <div className="section2 section">
            <h2>Miêu tả</h2>
            <div className="text">{carData.describe}</div>
          </div>
          <div className="section3 section">
            <h2>Thông tin người bán</h2>
            <div className="DealerInfo">
              <div className="item dealerNameAndAva">
                <div className="ava">
                  <img src={carData.idProvider.avatar} alt="" />
                </div>
                <div className="name">
                  <div className="text">{carData.idProvider.username}</div>
                  <div className="role">Người bán</div>
                </div>
              </div>
              {/* <div className="line"></div>

              <div className="item dealerPhoneNumber">
                <div className="icon">
                  <PhoneIcon></PhoneIcon>
                </div>
                <div className="phoneNumber">
                  {carData.idProvider.phoneNumber}
                </div>
              </div>
              <div className="line"></div>

              <div className="item dealerEmail">
                <div className="icon">
                  <EmailIcon></EmailIcon>
                </div>
                <div className="email">{carData.idProvider.email}</div>
              </div> */}
            </div>
          </div>
          <div className="section4 section">
            <h2>Để lại thông tin liên hệ</h2>
            <form action="" className="contactForm" onSubmit={handleSendMail}>
              <div className="userNameAndEmail">
                <div className="userName item">
                  <h4>
                    Tên <sup>*</sup>
                  </h4>
                  <input
                    type="text"
                    placeholder="Tên"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="userEmail item">
                  <h4>
                    Email <sup>*</sup>
                  </h4>
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="item">
                <h4>
                  Số điện thoại <sup>*</sup>
                </h4>
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="item comment">
                <h4>Bình luận</h4>
                <textarea
                  className="carPageTextarea"
                  type="text"
                  placeholder="Để loại bình luận"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <button type="submit">Liên hệ</button>
            </form>
          </div>
        </div>
        <div>
          <div className="frameRight">
            <h3>Thông tin về xe</h3>
            <p>
              Giá:{" "}
              <span>
                {carData?.carPrice
                  ? carData.carPrice.toLocaleString() + " vnđ"
                  : "Chưa có giá"}
              </span>
            </p>
            <div className="line"></div>
            <div className="section section1">
              <h4>Tổng quan</h4>
              <div className="content">
                <div className="row">
                  <div className="title">Phiên bản</div>
                  <div className="text">{carData.version}</div>
                </div>
                <div className="row">
                  <div className="title">Màu</div>
                  <div className="text">{carData.color}</div>
                </div>
                <div className="row">
                  <div className="title">Số ghế</div>
                  <div className="text">{carData.sitChairs}</div>
                </div>
                <div className="row">
                  <div className="title">ODO</div>
                  <div className="text">
                    {carData?.ODO
                      ? carData.ODO.toLocaleString() + " km"
                      : "Chưa có thông tin"}
                  </div>
                </div>
                <div className="row">
                  <div className="title">Năm sản xuất</div>
                  <div className="text">{carData.year}</div>
                </div>
                <div className="row">
                  <div className="title">Xuất xứ</div>
                  <div className="text">{carData.origin}</div>
                </div>
              </div>
            </div>
            <div className="line"></div>

            <div className="section section2">
              <h4>Thông số chi tiết</h4>
              <div className="content">
                <div className="row">
                  <div className="title">Hộp số</div>
                  <div className="text">{carData.gearBox}</div>
                </div>
                <div className="row">
                  <div className="title">Hệ dẫn động</div>
                  <div className="text">{carData.driveSystem}</div>
                </div>
                <div className="row">
                  <div className="title">Momen xoắn</div>
                  <div className="text">{carData.torque}</div>
                </div>
                <div className="row">
                  <div className="title">Động cơ</div>
                  <div className="text">{carData.engine}</div>
                </div>
                <div className="row">
                  <div className="title">Mã lực</div>
                  <div className="text">{carData.horsePower}</div>
                </div>
                <div className="row">
                  <div className="title">Năng lượng</div>
                  <div className="text">{carData.power}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default CarDetailPage;
