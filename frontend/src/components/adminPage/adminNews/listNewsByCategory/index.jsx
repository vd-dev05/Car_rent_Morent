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

const ListNewsByCategory = () => {
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
  // queryCountNews
  const [totalNews, setTotalNews] = useState();
  const [publishedNews, setPublishedNews] = useState();
  const [draftNews, setDraftNews] = useState();
  const queryCountNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/news/countNewsByCategory/${splitPathname[5]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTotalNews(response.data.totalNews);
      setPublishedNews(response.data.publishedNews);
      setDraftNews(response.data.draftNews);
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
    queryCountNews();
  }, []);
  // queryListNews
  const { isStatus } = useParams();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listNews, setListNews] = useState(null);
  const queryListNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/news/newsByCategory?limit=${limit}&currentPage=${currentPage}&isStatus=${isStatus}&isCategory=${splitPathname[5]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setListNews(response.data.data);
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
    queryListNews();
  }, [currentPage, limit]);
  useEffect(() => {
    setCurrentPage(1);
    if (currentPage === 1) {
      queryListNews();
    }
  }, [isStatus]);
  // đổi tên danh mục
  const getCategoryName = (category) => {
    switch (category) {
      case "carNews":
        return "Tin xe";
      case "marketNews":
        return "Tin thị trường";
      case "explore":
        return "Khám phá";
      default:
        return "Không xác định";
    }
  };
  // đổi tên trạng thái
  const getStatusName = (status) => {
    switch (status) {
      case "published":
        return "Đã xuất bản";
      case "draft":
        return "Đã lưu nháp";
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
  // xóa tin
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/news/deleteNewsById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      queryCountNews();
      queryListNews();
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
  if (!listNews) {
    return <Loading></Loading>;
  }
  return (
    <div className="listNewsByCategory">
      <div className="head">
        <h3>Bài viết theo danh mục: {getCategoryName(splitPathname[5])}</h3>
        <h5 onClick={() => navigate(`/news/${splitPathname[5]}`)}>
          Xem danh mục
        </h5>
      </div>
      <div className="newsFilter">
        <div
          className={
            pathname === `/admin/news/newsByCategory/all/${splitPathname[5]}`
              ? activeDiv
              : div
          }
          onClick={() =>
            navigate(`/admin/news/newsByCategory/all/${splitPathname[5]}`)
          }
        >
          <p>Tất cả</p>
          <p>({totalNews ? totalNews : 0})</p>
        </div>
        |
        <div
          className={
            pathname ===
            `/admin/news/newsByCategory/published/${splitPathname[5]}`
              ? activeDiv
              : div
          }
          onClick={() =>
            navigate(`/admin/news/newsByCategory/published/${splitPathname[5]}`)
          }
        >
          <p>Đã xuất bản</p>
          <p>({publishedNews ? publishedNews : 0})</p>
        </div>
        |
        <div
          className={
            pathname === `/admin/news/newsByCategory/draft/${splitPathname[5]}`
              ? activeDiv
              : div
          }
          onClick={() =>
            navigate(`/admin/news/newsByCategory/draft/${splitPathname[5]}`)
          }
        >
          <p>Bản nháp</p>
          <p>({draftNews ? draftNews : 0})</p>
        </div>
      </div>
      <div className="displayTable">
        <div className="table">
          <div className="thead">
            <p className="theadTitle">Tiêu đề</p>
            <p className="theadAuthor">Tác giả</p>
            <p className="theadTime">Thời gian</p>
            <p className="theadAction">Hành động</p>
          </div>
          {listNews.length !== 0 ? (
            <div className="tbody">
              {listNews.map((news, idx) => {
                return (
                  <div
                    key={idx + 1}
                    className="tr"
                    style={
                      news.isStatus === "draft"
                        ? { backgroundColor: "#2271B120" }
                        : { backgroundColor: "#FFFFFF" }
                    }
                  >
                    {news.title ? (
                      <h5 className="title">{news.title}</h5>
                    ) : (
                      <h5 className="title">Không có tiêu đề</h5>
                    )}
                    <p className="author">{news.author.username}</p>
                    <div className="time">
                      <p>{getStatusName(news.isStatus)}</p>
                      <p>
                        {moment(news.updatedAt).format("HH:mm, DD/MM/YYYY")}
                      </p>
                    </div>
                    <div className="action">
                      {news.isStatus === "published" ? (
                        <p
                          onClick={() => navigate(`/news/details/${news._id}`)}
                        >
                          Xem
                        </p>
                      ) : (
                        <p
                          onClick={() => navigate(`/news/details/${news._id}`)}
                        >
                          Xem trước
                        </p>
                      )}
                      <p
                        onClick={() =>
                          navigate(`/admin/news/editNews/${news._id}`)
                        }
                      >
                        Chỉnh sửa
                      </p>
                      <p onClick={() => handleDelete(news._id)}>Xóa bỏ</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <None content={"Chưa có tin tức nào"} />
          )}
        </div>
        {listNews.length !== 0 ? (
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

export default ListNewsByCategory;
