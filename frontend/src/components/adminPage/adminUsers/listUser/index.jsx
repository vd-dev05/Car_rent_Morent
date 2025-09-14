import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import moment from "moment";
import axios from "axios";
import { message } from "antd";
// Store
import { Store } from "../../../../Store";
// icons
import LeftArrowIcon from "../../../../icons/adminPage/LeftArrowIcon";
import RightArrowIcon from "../../../../icons/adminPage/RightArrowIcon";
//
import None from "../../none";
import Loading from "../../../Loading";
import "./style.css";

const div = "div";
const activeDiv = "activeDiv div";

const ListUsers = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const store = useContext(Store);
  let accessToken;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
  }
  const pathname = useLocation().pathname;
  // màn hình hiển thị ở đầu trang khi mở trang lên, thiết lập thanh cuộn trên đầu trang
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // queryCountUsers
  const [totalUsers, setTotalUsers] = useState();
  const [admin, setAdmin] = useState();
  const [provider, setProvider] = useState();
  const [customer, setCustomer] = useState();
  const queryCountUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/users/countUsers`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTotalUsers(response.data.totalUsers);
      setAdmin(response.data.admin);
      setProvider(response.data.provider);
      setCustomer(response.data.customer);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        switch (error.response.data.message) {
          case "jwt expired": {
            message
              .error("Token đã hết hạn, vui lòng đăng nhập lại!")
              .then(() => {
                store.setCurrentUser(null);
                navigate("/login");
              });
            return;
          }
          default:
            return message.error(error.response.data.message);
        }
      } else {
        message.error("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    queryCountUsers();
  }, []);
  // queryListUsers
  const { role } = useParams();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listUsers, setListUsers] = useState(null);
  // console.log(listUsers.length);

  const queryListUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/users?limit=${limit}&currentPage=${currentPage}&role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setListUsers(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        switch (error.response.data.message) {
          case "jwt expired": {
            message
              .error("Token đã hết hạn, vui lòng đăng nhập lại!")
              .then(() => {
                store.setCurrentUser(null);
                navigate("/login");
              });
            return;
          }
          default:
            return message.error(error.response.data.message);
        }
      } else {
        message.error("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    queryListUsers();
  }, [currentPage, limit]);
  useEffect(() => {
    setCurrentPage(1);
    if (currentPage === 1) {
      queryListUsers();
    }
  }, [role]);
  // đổi tên vai trò
  const getRoleName = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "PROVIDER":
        return "Nhà cung cấp";
      case "CUSTOMER":
        return "Khách hàng";
      default:
        return "Không xác định";
    }
  };
  // đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  // xóa người dùng
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/users/deleteUserById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      queryCountUsers();
      queryListUsers();
      message.success(response.data.message, 2);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        switch (error.response.data.message) {
          case "jwt expired": {
            message
              .error("Token đã hết hạn, vui lòng đăng nhập lại!", 2)
              .then(() => {
                store.setCurrentUser(null);
                navigate("/login");
              });
            return;
          }
          default:
            return message.error(error.response.data.message, 2);
        }
      } else {
        message.error("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };
  if (!listUsers) {
    return <Loading></Loading>;
  }
  return (
    <div className="listUsers">
      <h3>Thành viên</h3>
      <div className="usersFilter">
        <div
          className={pathname === "/admin/users/all" ? activeDiv : div}
          onClick={() => navigate("/admin/users/all")}
        >
          <p>Tất cả</p>
          <p>({totalUsers ? totalUsers : 0})</p>
        </div>
        |
        <div
          className={pathname === "/admin/users/admin" ? activeDiv : div}
          onClick={() => navigate("/admin/users/admin")}
        >
          <p>Quản trị viên</p>
          <p>({admin ? admin : 0})</p>
        </div>
        |
        <div
          className={pathname === "/admin/users/provider" ? activeDiv : div}
          onClick={() => navigate("/admin/users/provider")}
        >
          <p>Nhà cung cấp</p>
          <p>({provider ? provider : 0})</p>
        </div>
        |
        <div
          className={pathname === "/admin/users/customer" ? activeDiv : div}
          onClick={() => navigate("/admin/users/customer")}
        >
          <p>Khách hàng</p>
          <p>({customer ? customer : 0})</p>
        </div>
      </div>
      <div className="displayTable">
        <div className="table">
          <div className="thead">
            <p className="theadUsername">Tên người dùng</p>
            <p className="theadEmail">Email</p>
            <p className="theadRole">Vai trò</p>
            <p className="theadTime">Thời gian đăng ký</p>
            <p className="theadAction">Hành động</p>
          </div>
          {listUsers.length !== 0 ? (
            <div className="tbody">
              {listUsers.map((user, idx) => {
                return (
                  <div key={idx + 1} className="tr">
                    <div className="username">
                      <img src={user.avatar} alt="" />
                      <h5>{user.username}</h5>
                    </div>
                    <p className="email">{user.email}</p>
                    <p className="role">{getRoleName(user.role)}</p>
                    <p className="time">
                      {moment(user.createdAt).format("HH:mm, DD/MM/YYYY")}
                    </p>
                    <div className="action">
                      <button
                        onClick={() =>
                          navigate(`/admin/users/viewUserInfo/${user._id}`)
                        }
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/users/editUserInfo/${user._id}`)
                        }
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={user.role === "ADMIN"}
                      >
                        Xóa bỏ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <None content={"Chưa có người nào"} />
          )}
        </div>
        {listUsers.length !== 0 ? (
          <div className="pagination">
            <select name="" id="" onChange={(e) => setLimit(e.target.value)}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <LeftArrowIcon />
            </button>
            <h5>
              Trang {currentPage}/{totalPages}
            </h5>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <RightArrowIcon />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default ListUsers;
