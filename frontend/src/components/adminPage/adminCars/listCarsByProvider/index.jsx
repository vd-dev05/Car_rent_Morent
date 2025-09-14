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

const ListCarsByProvider = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const store = useContext(Store);
  let accessToken;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
  }
  const pathname = useLocation().pathname;
  const splitPathname = pathname.split("/");
  // màn hình hiển thị ở đầu trang khi mở trang lên, thiết lập thanh cuộn trên đầu trang
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // queryCountCars
  const [totalCars, setTotalCars] = useState();
  const [approvedCars, setApprovedCars] = useState();
  const [pendingCars, setPendingCars] = useState();
  const queryCountCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/cars/countCarsByProvider/${splitPathname[5]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTotalCars(response.data.totalCars);
      setApprovedCars(response.data.approvedCars);
      setPendingCars(response.data.pendingCars);
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
    queryCountCars();
  }, []);
  // queryListCars
  const { isStatus } = useParams();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listCars, setListCars] = useState(null);
  const [usernameProvider, setUsernameProvider] = useState();
  const queryListCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/cars/carByProvider?limit=${limit}&currentPage=${currentPage}&isStatus=${isStatus}&idProvider=${splitPathname[5]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setListCars(response.data.data);
      setTotalPages(response.data.totalPages);
      setUsernameProvider(response.data.usernameProvider);
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
    queryListCars();
  }, [currentPage, limit]);
  useEffect(() => {
    setCurrentPage(1);
    if (currentPage === 1) {
      queryListCars();
    }
  }, [isStatus]);
  // đổi tên trạng thái
  const getStatusName = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "pending":
        return "Chưa duyệt";
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
  // xóa xe
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/cars/deletecar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      queryCountCars();
      queryListCars();
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
  // duyệt đăng bán xe
  const handleApproveCar = async (id, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/cars/changeStatusCar/${id}`,
        {
          newStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      queryCountCars();
      queryListCars();
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
  if (!listCars) {
    return <Loading></Loading>;
  }
  return (
    <div className="listCarsByProvider">
      <div className="head">
        <h3>Xe theo nhà cung cấp: {usernameProvider}</h3>
        {/* <h5>Xem</h5> */}
      </div>
      <div className="carsFilter">
        <div
          className={
            pathname === `/admin/cars/carsByProvider/all/${splitPathname[5]}`
              ? activeDiv
              : div
          }
          onClick={() =>
            navigate(`/admin/cars/carsByProvider/all/${splitPathname[5]}`)
          }
        >
          <p>Tất cả</p>
          <p>({totalCars ? totalCars : 0})</p>
        </div>
        |
        <div
          className={
            pathname ===
            `/admin/cars/carsByProvider/approved/${splitPathname[5]}`
              ? activeDiv
              : div
          }
          onClick={() =>
            navigate(`/admin/cars/carsByProvider/approved/${splitPathname[5]}`)
          }
        >
          <p>Đã duyệt</p>
          <p>({approvedCars ? approvedCars : 0})</p>
        </div>
        |
        <div
          className={
            pathname ===
            `/admin/cars/carsByProvider/pending/${splitPathname[5]}`
              ? activeDiv
              : div
          }
          onClick={() =>
            navigate(`/admin/cars/carsByProvider/pending/${splitPathname[5]}`)
          }
        >
          <p>Chưa duyệt</p>
          <p>({pendingCars ? pendingCars : 0})</p>
        </div>
      </div>
      <div className="displayTable">
        <div className="table">
          <div className="thead">
            <p className="theadName">Tên xe</p>
            <p className="theadBrand">Tên hãng</p>
            <p className="theadState">Tình trạng</p>
            <p className="theadTime">Thời gian</p>
            <p className="theadAction">Hành động</p>
          </div>
          {listCars.length !== 0 ? (
            <div className="tbody">
              {listCars.map((car, idx) => {
                return (
                  <div
                    key={idx + 1}
                    className="tr"
                    style={
                      car.isStatus === "pending"
                        ? { backgroundColor: "#2271B120" }
                        : { backgroundColor: "#FFFFFF" }
                    }
                  >
                    <p className="name">{car.carName}</p>
                    <p className="brand">{car.brand}</p>
                    <p className="state">{car.state}</p>
                    <div className="time">
                      <p>{getStatusName(car.isStatus)}</p>
                      <p>{moment(car.updatedAt).format("HH:mm, DD/MM/YYYY")}</p>
                    </div>
                    <div className="action">
                      {car.isStatus === "approved" ? (
                        <p onClick={() => navigate(`/car/${car._id}`)}>Xem</p>
                      ) : (
                        <p onClick={() => navigate(`/car/${car._id}`)}>
                          Xem trước
                        </p>
                      )}
                      <p
                        onClick={() =>
                          navigate(`/admin/cars/editCarInfo/${car._id}`)
                        }
                      >
                        Chỉnh sửa
                      </p>
                      <p onClick={() => handleDelete(car._id)}>Xóa bỏ</p>
                      {car.isStatus === "approved" ? (
                        <p onClick={() => handleApproveCar(car._id, "pending")}>
                          Bỏ duyệt
                        </p>
                      ) : (
                        <p
                          onClick={() => handleApproveCar(car._id, "approved")}
                        >
                          Duyệt
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <None content={"Chưa có xe nào"} />
          )}
        </div>
        {listCars.length !== 0 ? (
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

export default ListCarsByProvider;
