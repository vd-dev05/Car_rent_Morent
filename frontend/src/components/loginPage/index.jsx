//library
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
// store
import { Store } from "../../Store";
// imgs
import Background from "/public/imgs/background.png";
// svgs
import ArrowRightIcon from "../../icons/loginAndRegister/ArrowRightIcon";
//
import Loading from "../Loading";
import "./style.css";

const LoginPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);
  const navigate = useNavigate();
  const store = useContext(Store);
  useEffect(() => {
    if (store.currentUser) {
      navigate("/");
    }
  }, []);
  // màn hình hiển thị ở đầu trang khi mở trang lên, thiết lập thanh cuộn trên đầu trang
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // submit
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/login`,
        formData,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data) {
        // localStorage.setItem("currentUser", JSON.stringify(data.data));
        store.setCurrentUser(data.data);
      }
      message.success(response.data.message, 2);
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="loginPage">
      <img src={Background} alt="" className="background" />
      <div className="overlay">
        <div className="content">
          <h1>Đăng nhập</h1>
          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="row">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Điền email của bạn"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Đăng nhập</button>
          </form>
          <div className="groupRedirectToRegister">
            <p>Bạn chưa có tài khoản?</p>
            <div
              className="redirectToRegister"
              onClick={() => {
                navigate("/register");
              }}
            >
              <p>Đăng ký</p>
              <ArrowRightIcon />
            </div>
          </div>
        </div>
      </div>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default LoginPage;
