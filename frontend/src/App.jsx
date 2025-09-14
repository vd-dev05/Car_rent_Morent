//library
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { message } from "antd";
import { useEffect } from "react";
// component
// Footer + Header
import Footer from "./components/footer";
import Header from "./components/header";
// AdminPage
import AdminPage from "./components/adminPage";
// AdminOverview
import AdminOverview from "./components/adminPage/adminOverview";
// AdminUsers
import AdminUsers from "./components/adminPage/adminUsers";
import ListUsers from "./components/adminPage/adminUsers/listUser";
import ListRegisterProvider from "./components/adminPage/adminUsers/listRegisterProvider";
import ViewUserInfo from "./components/adminPage/adminUsers/ViewEdit/viewUserInfo";
import EditUserInfo from "./components/adminPage/adminUsers/ViewEdit/editUserInfo";
// AdminCars
import AdminCars from "./components/adminPage/adminCars";
import ListCars from "./components/adminPage/adminCars/listCars";
import ListCarsByBrand from "./components/adminPage/adminCars/listCarsByBrand";
import ListCarsByProvider from "./components/adminPage/adminCars/listCarsByProvider";
import ListCarsByState from "./components/adminPage/adminCars/listCarsByState";
import EditCarInfo from "./components/adminPage/adminCars/editCarInfo";
// AdminNews
import AdminNews from "./components/adminPage/adminNews";
import ListNews from "./components/adminPage/adminNews/listNews";
import ListNewsByCategory from "./components/adminPage/adminNews/listNewsByCategory";
import CreateNews from "./components/adminPage/adminNews/CreateEdit/createNews";
import EditNews from "./components/adminPage/adminNews/CreateEdit/editNews";
// AdminComments
import AdminComments from "./components/adminPage/adminComments";
import ListComments from "./components/adminPage/adminComments/listComments";
import ListCommentsByNews from "./components/adminPage/adminComments/listCommentsByNews";
//
import NotFoundPage from "./components/notFoundPage";
import LoginPage from "./components/loginPage";
import RegisterPage from "./components/registerPage";
import ProfilePage from "./components/profilePage";
import HomePage from "./components/homePage";
import IntroducePage from "./components/introducePage";
import ContactPage from "./components/contactPage";
import CategoryPage from "./components/categoryPage";
import NewsDetailPage from "./components/newsDetailsPage";
import NewsPage from "./components/newsPage";
import NewsOverview from "./components/newsPage/newsOverview";
import NewsByCategory from "./components/newsPage/newsByCategory";
// import PageWithAllCar from "./components/categoryPage/PageWithAllCar";
// import PageWithCarByBrand from "./components/categoryPage/PageWithCarByBrand";
import CarDetailPage from "./components/carPage";
//provider
import PostingCarInfoPage from "./components/postingCarInfoPage";
import ProviderPage from "./components/providerPage";
import PostManage from "./components/providerPage/postManage";
import ContactMailManage from "./components/providerPage/contactMailProvider";
//
import SearchPage from "./components/searchPage";
import MailPage from "./components/profilePage/addToProfilePage/UserMail";
import WishListPage from "./components/wishListPage/index";

//
import "./App.css";
const socket = io(import.meta.env.VITE_API_BASE_URL); // Kết nối đến server

function App() {
  useEffect(() => {
    const crrUser = localStorage.getItem("currentUser");
    if (crrUser) {
      const userObj = JSON.parse(crrUser);
      if (userObj && userObj._id) {
        socket.emit("join_room", userObj._id); // Chỉ tham gia phòng nếu userId hợp lệ
      }
    }

    socket.on("mailStatusChanged", (data) => {
      message.success(data.message); // Hiển thị thông báo người bán cho người hỏi mua
    });
    socket.on("sendMail", (data) => {
      message.success(data.message); // Hiển thị thông báo khi người mua gửi đơn cho người bán
    });
    socket.on("register-provider", (data) => {
      message.success(data.message); // Hiển thị thông báo đăng kí làm provider cho admin
    });
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("currentUser");
      if (!updatedUser) {
        socket.emit("leave_room"); // Rời khỏi phòng khi đăng xuất
      }
    };

    window.addEventListener("storage", handleStorageChange); //Khi có tab nào của trình duyệt thay đổi dữ liệu trong localStorage, sự kiện này sẽ được kích hoạt.
    /*
    Khi dữ liệu trong localStorage thay đổi (ví dụ: user đăng xuất, localStorage.removeItem("currentUser")), handleStorageChange sẽ chạy.
    Nếu không tìm thấy currentUser trong localStorage, nghĩa là người dùng đã đăng xuất.
    Gửi một sự kiện leave_room lên socket để thông báo rằng user không còn online nữa.
    */
    //cleanup function. Xóa hết dữ liệu cũ.
    return () => {
      window.removeEventListener("storage", handleStorageChange); //hủy sự kiện
      socket.off("mailStatusChanged");
      socket.off("sendMail");
      socket.off("register-provider");
    };
  }, []);

  return (
    <div className="container">
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />}>
            <Route path="" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />}>
              <Route path=":role" element={<ListUsers />} />
              <Route path="applys" element={<ListRegisterProvider />} />
              <Route path="viewUserInfo/:id" element={<ViewUserInfo />} />
              <Route path="editUserInfo/:id" element={<EditUserInfo />} />
            </Route>
            <Route path="cars" element={<AdminCars />}>
              <Route path=":isStatus" element={<ListCars />} />
              <Route
                path="carsByBrand/:isStatus/:brand"
                element={<ListCarsByBrand />}
              />
              <Route
                path="carsByState/:isStatus/:state"
                element={<ListCarsByState />}
              />
              <Route
                path="carsByProvider/:isStatus/:idProvider"
                element={<ListCarsByProvider />}
              />
              <Route path="editCarInfo/:id" element={<EditCarInfo />} />
            </Route>
            <Route path="news" element={<AdminNews />}>
              <Route path=":isStatus" element={<ListNews />} />
              <Route
                path="newsByCategory/:isStatus/:isCategory"
                element={<ListNewsByCategory />}
              />
              <Route path="createNews" element={<CreateNews />} />
              <Route path="editNews/:id" element={<EditNews />} />
            </Route>
            <Route path="comments" element={<AdminComments />}>
              <Route path=":isStatus" element={<ListComments />} />
              <Route
                path="commentsByNews/:isStatus/:id"
                element={<ListCommentsByNews />}
              />
            </Route>
          </Route>
          <Route path="/provider/:idUser" element={<ProviderPage />}>
            <Route path="postmanage" element={<PostManage />}></Route>
            <Route
              path="mailContactManage"
              element={<ContactMailManage />}
            ></Route>
          </Route>
          <Route path="/car/:idCar" element={<CarDetailPage />} />
          <Route path="/postingCar" element={<PostingCarInfoPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* <Route path="/usermail/:userId" element={<MailPage />} /> */}
          {/* Thêm cái này vào phần profile user */}
          <Route
            path="/profile/:activepage/:userId"
            element={<ProfilePage />}
          />
          <Route path="/wishList/:userId" element={<WishListPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/allCars" element={<CategoryPage />}></Route>
          <Route path="/news/details/:id" element={<NewsDetailPage />} />
          <Route path="/news" element={<NewsPage />}>
            <Route path="" element={<NewsOverview />} />
            <Route path=":isCategory" element={<NewsByCategory />} />
          </Route>
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/introduce" element={<IntroducePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
// "preview": "vite preview"
