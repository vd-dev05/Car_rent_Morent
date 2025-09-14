import { React, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import "../userprofile/Account.css";
import axios from "axios";
import moment from "moment";
// import { Button } from "antd";
import { Store } from "../../../Store";
import Loading from "../../Loading";

const Account = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const navigate = useNavigate();
  const store = useContext(Store);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!store.currentUser) {
      navigate("/");
    }
  }, []);
  let accessToken;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
  }

  //dữ liệu user
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `${API_BASE_URL}/api/v1/users/${store.currentUser._id}`
        );
        setUserData(userResponse.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, [userId]);

  const registerProvider = async () => {
    if (
      !userData.fullname ||
      !userData.phoneNumber ||
      !userData.dateOfBirth ||
      !userData.address
    ) {
      message.error(
        "Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi đăng ký!"
      );
      navigate(`/profile/accountsetting/${userId}`);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/applications/registerProvider/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success(response.data.message);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <Loading></Loading>;
  } else {
    console.log(userData);
  }

  const formatDate = (d) => {
    if (d != null) {
      const date = new Date(d);
      const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      const month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }

    return null;
  };

  // if (!carData) {
  //   return <Loading></Loading>;
  // }
  return (
    <div className="account">
      <div className="form">
        <div className="avatar">
          <img src={userData.avatar} alt="" />
        </div>
        <div className="otherInfo">
          <div className="grUsername">
            <h4 htmlFor="username">Username</h4>
            <input
              type="text"
              id="username"
              value={userData.username}
              disabled
            />
          </div>
          <div className="grEmail">
            <h4 htmlFor="email">Email</h4>
            <input type="text" id="email" value={userData.email} disabled />
          </div>
          <div className="grFullname">
            <h4 htmlFor="fullname">Họ tên</h4>
            {userData.fullname ? (
              <input
                type="text"
                id="fullname"
                value={userData.fullname}
                disabled
              />
            ) : (
              <input
                type="text"
                id="fullname"
                value={"Chưa có thông tin"}
                disabled
              />
            )}
          </div>
          <div className="grPhoneNumber">
            <h4 htmlFor="phoneNumber">Số điện thoại</h4>
            {userData.phoneNumber ? (
              <input
                type="text"
                id="phoneNumber"
                value={userData.phoneNumber}
                disabled
              />
            ) : (
              <input
                type="text"
                id="phoneNumber"
                value={"Chưa có thông tin"}
                disabled
              />
            )}
          </div>
          <div className="grAddress">
            <h4 htmlFor="address">Địa chỉ</h4>
            {userData.address ? (
              <input
                type="text"
                id="address"
                value={userData.address}
                disabled
              />
            ) : (
              <input
                type="text"
                id="address"
                value={"Chưa có thông tin"}
                disabled
              />
            )}
          </div>
          <div className="grDateOfBirth">
            <h4 htmlFor="dateOfBirth">Ngày sinh</h4>
            {userData.dateOfBirth ? (
              <input
                type="date"
                id="dateOfBirth"
                value={moment(userData.dateOfBirth).format("YYYY-MM-DD")}
                disabled
              />
            ) : (
              <input
                type="text"
                id="dateOfBirth"
                value={"Chưa có thông tin"}
                disabled
              />
            )}
          </div>
          {/* <p>Role: {userData.role} </p> */}
        </div>


        {userData.role === 'PROVIDER' && (

//         {userData.role === "PROVIDER" ? (

          <div className="provider pro">
            <button
              className="btn-provider btn"
              onClick={() => navigate(`/provider/${store.currentUser._id}`)}
            >
              Quản lý tin đăng bán và đơn hàng
            </button>
          </div>
        )}

        {userData.role === 'CUSTOMER' && (
          <div className="registerProvider pro">
            <button
              className="btn-registerProvider btn"
              onClick={registerProvider}
            >
              Đăng ký trở thành nhà cung cấp
            </button>
          </div>
        )}

        {userData.role === 'ADMIN' && null}
      </div>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default Account;
