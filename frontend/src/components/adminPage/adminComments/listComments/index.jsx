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

const ListComments = () => {
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
  // queryCountComments
  const [totalComments, setTotalComments] = useState();
  const [approvedComments, setApprovedComments] = useState();
  const [spamComments, setSpamComments] = useState();
  const queryCountComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/comments/countComments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTotalComments(response.data.totalComments);
      setApprovedComments(response.data.approvedComments);
      setSpamComments(response.data.spamComments);
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
    queryCountComments();
  }, []);
  // queryListComments
  const { isStatus } = useParams();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listComments, setListComments] = useState(null);
  const queryListComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/comments?limit=${limit}&currentPage=${currentPage}&isStatus=${isStatus}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setListComments(response.data.data);
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
    queryListComments();
  }, [currentPage, limit]);
  useEffect(() => {
    setCurrentPage(1);
    if (currentPage === 1) {
      queryListComments();
    }
  }, [isStatus]);
  // đổi tên trạng thái
  const getStatusName = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "spam":
        return "Bình luận rác";
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
  // xóa bình luận
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/comments/deleteCommentById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      queryCountComments();
      queryListComments();
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
  // thay đổi trạng thái bình luận
  const handleChangeCommentStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/comments/changeCommentStatus`,
        {
          commentId: id,
          newStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      queryCountComments();
      queryListComments();
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
  // chỉnh sửa bình luận
  const [displayP, setDisplayP] = useState("");
  const [displayInput, setDisplayInput] = useState("");
  const [content, setContent] = useState("");
  const setDisplay = (p, input, content) => {
    setDisplayP(p);
    setDisplayInput(input);
    setContent(content);
  };
  // console.log(displayP);
  // console.log(displayInput);
  // console.log(content);
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/comments/edit-comment/${id}`,
        {
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDisplayP("");
      setDisplayInput("");
      setContent("");
      queryListComments();
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
  if (!listComments) {
    return <Loading></Loading>;
  }
  return (
    <div className="listComments">
      <h3>Bình luận</h3>
      <div className="commentsFilter">
        <div
          className={pathname === "/admin/comments/all" ? activeDiv : div}
          onClick={() => navigate("/admin/comments/all")}
        >
          <p>Tất cả</p>
          <p>({totalComments ? totalComments : 0})</p>
        </div>
        |
        <div
          className={pathname === "/admin/comments/approved" ? activeDiv : div}
          onClick={() => navigate("/admin/comments/approved")}
        >
          <p>Đã duyệt</p>
          <p>({approvedComments ? approvedComments : 0})</p>
        </div>
        |
        <div
          className={pathname === "/admin/comments/spam" ? activeDiv : div}
          onClick={() => navigate("/admin/comments/spam")}
        >
          <p>Bình luận rác</p>
          <p>({spamComments ? spamComments : 0})</p>
        </div>
      </div>
      <div className="displayTable">
        <div className="table">
          <div className="thead">
            <p className="theadAuthor">Tác giả</p>
            <p className="theadComment">Bình luận</p>
            <p className="theadNews">Bình luận về</p>
            <p className="theadTime">Thời gian</p>
            <p className="theadAction">Hành động</p>
          </div>
          {listComments.length !== 0 ? (
            <div className="tbody">
              {listComments.map((comment, idx) => {
                return (
                  <div
                    key={idx + 1}
                    className="tr"
                    style={
                      comment.isStatus === "spam"
                        ? { backgroundColor: "#2271B120" }
                        : { backgroundColor: "#FFFFFF" }
                    }
                  >
                    <div className="author">
                      <img src={comment.user.avatar} alt="" />
                      <h5>{comment.user.username}</h5>
                    </div>
                    <div className="comment">
                      <p
                        style={
                          displayP === `p${idx}`
                            ? { display: "none" }
                            : { display: "block" }
                        }
                      >
                        {comment.content}
                      </p>
                      <textarea
                        style={
                          displayInput === `input${idx}`
                            ? { display: "block" }
                            : { display: "none" }
                        }
                        placeholder="Hãy viết bình luận"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                      <div
                        style={
                          displayInput === `input${idx}`
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                        className="row"
                      >
                        <button onClick={() => handleEdit(comment._id)}>
                          Cập nhật
                        </button>
                        <button onClick={() => setDisplay("", "", "")}>
                          Hủy bỏ
                        </button>
                      </div>
                    </div>
                    <div className="news">
                      <h5
                        onClick={() =>
                          navigate(`/admin/news/editNews/${comment.news._id}`)
                        }
                      >
                        {comment.news.title}
                      </h5>
                      <div className="row">
                        <p
                          onClick={() =>
                            navigate(`/news/details/${comment.news._id}`)
                          }
                        >
                          Xem tin tức
                        </p>
                        <p
                          onClick={() =>
                            navigate(
                              `/admin/comments/commentsByNews/all/${comment.news._id}`
                            )
                          }
                        >
                          Xem tất cả bình luận
                        </p>
                      </div>
                    </div>
                    <div className="time">
                      <p>{getStatusName(comment.isStatus)}</p>
                      <p>
                        {moment(comment.updatedAt).format("HH:mm, DD/MM/YYYY")}
                      </p>
                    </div>
                    <div className="action">
                      <button
                        disabled={displayInput === `input${idx}`}
                        onClick={() =>
                          setDisplay(`p${idx}`, `input${idx}`, comment.content)
                        }
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        disabled={displayInput === `input${idx}`}
                        onClick={() => handleDelete(comment._id)}
                      >
                        Xóa bỏ
                      </button>
                      {comment.isStatus === "approved" ? (
                        <button
                          disabled={displayInput === `input${idx}`}
                          style={{ color: "#B32D2E" }}
                          onClick={() =>
                            handleChangeCommentStatus(comment._id, "spam")
                          }
                        >
                          Bình luận rác
                        </button>
                      ) : (
                        <button
                          disabled={displayInput === `input${idx}`}
                          style={{ color: "#2271B1" }}
                          onClick={() =>
                            handleChangeCommentStatus(comment._id, "approved")
                          }
                        >
                          Khôi phục
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <None content={"Chưa có bình luận nào"} />
          )}
        </div>
        {listComments.length !== 0 ? (
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

export default ListComments;
