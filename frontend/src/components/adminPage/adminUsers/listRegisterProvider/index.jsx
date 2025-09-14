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

const ListRegisterProvider = () => {
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
  // queryCountApplys
  const [totalApplys, setTotalApplys] = useState();
  const queryCountApplys = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/applications/countApplys`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTotalApplys(response.data.totalApplys);
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
    queryCountApplys();
  }, []);
  // queryListApplys
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listApplys, setListApplys] = useState(null);
  console.log(listApplys);

  const queryListApplys = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/applications/getAllApplys?limit=${limit}&currentPage=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setListApplys(response.data.data);
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
    queryListApplys();
  }, [currentPage, limit]);
  useEffect(() => {
    setCurrentPage(1);
    if (currentPage === 1) {
      queryListApplys();
    }
  }, []);
  // đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  // duyệt đơn đăng ký
  const handleApproveApply = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/applications/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      queryCountApplys();
      queryListApplys();
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
  if (!listApplys) {
    return <Loading></Loading>;
  }
  return (
    <div className="listApplys">
      <h3>Đơn đăng ký</h3>
      <div>
        <p>Có {totalApplys} đơn đăng ký</p>
      </div>
      <div className="displayTable">
        <div className="table">
          <div className="thead">
            <p className="theadInfo">Thông tin cá nhân</p>
            <p className="theadTime">Thời gian đăng ký</p>
            <p className="theadAction">Hành động</p>
          </div>
          {totalApplys !== -0 ? (
            <div className="tbody">
              {listApplys.map((apply, idx) => {
                return (
                  <div
                    key={idx + 1}
                    className="tr"
                    style={
                      apply.isStatus === "pending"
                        ? { backgroundColor: "#2271B120" }
                        : { backgroundColor: "#FFFFFF" }
                    }
                  >
                    <div className="info">
                      <div className="img">
                        <img src={apply.userId.avatar} alt="" />
                      </div>
                      <div className="otherInfo">
                        <div className="row">
                          <h5>Username:</h5>
                          <i>{apply.userId.username}</i>
                        </div>
                        <div className="row">
                          <h5>Họ tên:</h5>
                          <i>{apply.userId.fullname}</i>
                        </div>
                        <div className="row">
                          <h5>Ngày sinh:</h5>
                          <i>
                            {moment(apply.userId.dateOfBirth).format(
                              "DD/MM/YYYY"
                            )}
                          </i>
                        </div>
                        <div className="row">
                          <h5>Email:</h5>
                          <i>{apply.userId.email}</i>
                        </div>
                        <div className="row">
                          <h5>Địa chỉ:</h5>
                          <i>{apply.userId.address}</i>
                        </div>
                        <div className="row">
                          <h5>Số điện thoại:</h5>
                          <i>{apply.userId.phoneNumber}</i>
                        </div>
                      </div>
                    </div>
                    <p className="time">
                      {moment(apply.updatedAt).format("HH:mm, DD/MM/YYYY")}
                    </p>
                    <div className="action">
                      <p onClick={() => handleApproveApply(apply._id)}>Duyệt</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <None content={"Chưa có đơn đăng ký nào"} />
          )}
        </div>
        {totalApplys !== 0 ? (
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

export default ListRegisterProvider;
