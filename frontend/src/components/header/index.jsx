//library
import { React, useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// store
import { Store } from "../../Store";
// imgs
import LogoWhite from "/public/imgs/logoWhite.png";
import LogoBlack from "/public/imgs/logoBlack.png";
// svgs
import ProfileIcon from "../../icons/header/ProfileIcon";
import LogoutIcon from "../../icons/header/LogoutIcon";
import WishIcon from '../../icons/header/WishListIcon';
//
import "./style.css";

const Header = () => {
  const navigate = useNavigate();
  const store = useContext(Store);
  let currentUser = store.currentUser;
  useEffect(() => {
    currentUser = store.currentUser;
  }, [])



  // const [userData, setUserData] = useState(null);
  // useEffect(() => {
  //   if (store.currentUser) {
  //     const accessToken = store.currentUser.accessToken;
  //     const userId = store.currentUser._id;
  //     const fetchUserData = async () => {
  //       try {
  //         const response = await axios.get(`http://localhost:8080/api/v1/users/${userId}`,
  //           {
  //             headers: {
  //                 'Authorization': `Bearer ${accessToken}`,
  //             },
  //           }
  //         );
  //         setUserData(response.data.data);
  //       } catch (error) {
  //           if (error.response && error.response.data && error.response.data.message) {
  //             console.error(error.response.data.message);
  //           } else {
  //             message.error('Lỗi không xác định');
  //           }
  //       }
  //     };
  //     fetchUserData();
  //   } else {
  //     setUserData(null); // Đặt userData về null nếu currentUser không tồn tại
  //   }
  // }); // useEffect sẽ chạy lại khi store.currentUser thay đổi
  // console.log(userData);



  // đăng xuất
  const handleClick = () => {
    store.setCurrentUser(null);
    navigate("/");
  };
  return (
    <div className="header">
      {currentUser && currentUser.role === "ADMIN" ?
        (<div className="grRedirect">
          <div className="redirect redirectToAdminPage" onClick={() => navigate("/admin")}>
            <p className="logoutIcon"><LogoutIcon /></p>
            <h5>Đi đến trang quản trị</h5>
          </div>
          <div className="redirect redirectToTheWebsite" onClick={() => navigate("/")}>
            <p className="logoutIcon"><LogoutIcon /></p>
            <h5>Trở lại trang WEB</h5>
          </div>
        </div>) :
        ("")}
      <div className="gr">
        <div className="gr1">
          <img src={LogoWhite} alt="" onClick={() => navigate("/")} className="logoWhite"/>
          <img src={LogoBlack} alt="" onClick={() => navigate("/")} className="logoBlack"/>
        </div>
        <div className="gr2">
          <h5 onClick={() => navigate("/allCars")}>Sản phẩm</h5>
          <h5 onClick={() => navigate("/news")}>Tin tức</h5>
          <h5 onClick={() => navigate("/contact")}>Liên hệ</h5>
          <h5 onClick={() => navigate("/introduce")}>Giới thiệu</h5>
        </div>
        {!currentUser ?
          (<div className="gr3_1">
            <h5 onClick={() => navigate("/login")}>Login</h5>
            <div style={{ width: "1px", height: "15px", margin: "0 10px" }} className="partition"></div>
            <h5 onClick={() => navigate("/register")}>Register</h5>
          </div>) :
          (<div className="gr3_2">
            <div className="grDropdown">
              <div className="info">
                <div className="other">
                  <h5>{currentUser.username}</h5>
                  <i>{currentUser.role}</i>
                </div>
                <img src={currentUser.avatar} class="avatar-img" alt="" />
              </div>
              <div className="dropdown">
                <div className="grProfile" onClick={() => navigate("/profile/account/" + currentUser._id)}>
                  <p className="profileIcon"><ProfileIcon /></p>
                  <p className="profile">Profile</p>
                </div>
                  <div className="grWishList" onClick={() => navigate("/wishList/" + currentUser._id)}>
                    <p className="wishIcon"><WishIcon /></p>
                    <p className="wishList">Favorites</p>
                  </div>
                <div className="grLogout" onClick={handleClick}>
                  <p className="logoutIcon"><LogoutIcon /></p>
                  <p className="logout">Logout</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;