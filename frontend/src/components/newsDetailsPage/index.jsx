import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import moment from "moment";
import axios from "axios";
import { message } from "antd";
//
import { Store } from "../../Store";
//
import CommentIcon from "../../icons/newsDetailsPage/CommentIcon";
//
import Loading from "../Loading";
import "./style.css";

const NewsDetailPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const store = useContext(Store);
  let accessToken;
  let role;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
    role = store.currentUser.role;
  }
  // màn hình hiển thị ở đầu trang khi mở trang lên, thiết lập thanh cuộn trên đầu trang
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // queryNews, queryListNews, queryListComment
  const { id } = useParams();
  const [news, setNews] = useState({});
  const [listNews, setListNews] = useState([]);
  const [listComments, setListComments] = useState([]);
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (status === "draft" && role !== "ADMIN") {
      navigate("/");
    }
  });
  const queryNews = async () => {
    setLoading(true);
    try {
      const queryNews = await axios.get(`${API_BASE_URL}/api/v1/news/${id}`);
      const data = queryNews.data.data;
      setStatus(queryNews.data.data.isStatus);
      if (data) {
        axios
          .all([
            axios.get(
              `${API_BASE_URL}/api/v1/news/publishedByCategory?limit=6&isCategory=${data.isCategory}`
            ),
            axios.get(
              `${API_BASE_URL}/api/v1/comments/commentByNewsId?isStatus=approved&newsId=${id}`
            ),
          ])
          .then(
            axios.spread((response1, response2) => {
              setListNews(response1.data.data);
              setListComments(response2.data.data);
            })
          );
      }
      setNews(data);
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
  useEffect(() => {
    queryNews();
  }, [id]);
  // tạo bình luận mới
  const [content, setContent] = useState("");
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      content,
      newsId: id,
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/comments/create-comment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "application/json",
          },
        }
      );
      message.loading("Đang gửi bình luận!", 1).then(() => {
        setLoading(false);
        queryNews();
        setContent("");
      });
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        switch (error.response.data.message) {
          case "jwt malformed": {
            message
              .error("Bạn không thể thực hiện hành động, vui lòng đăng nhập!")
              .then(() => {
                navigate("/login");
              });
            return;
          }
          case "jwt expired": {
            message
              .error("Token đã hết hạn, vui lòng đăng nhập lại!")
              .then(() => {
                store.setCurrentUser(null);
                navigate("/login");
              });
            return;
          }
          case "Tin tức chưa xuất bản, không thể bình luận!":
            return message.error("Tin tức chưa xuất bản, không thể bình luận!");
          default:
            return message.error(error.response.data.message);
        }
      } else {
        message.error("Lỗi không xác định");
      }
    }
  };
  return (
    <div className="newsDetailsPage">
      <div className="left">
        <h2>{news.title}</h2>
        <div className="row">
          {news.author ? (
            <div className="author">
              <img src={news.author.avatar} alt="" />
              <h5>{news.author.username}</h5>
            </div>
          ) : (
            ""
          )}
          <p className="time">
            {moment(news.createdAt).format("HH:mm, DD/MM/YYYY")}
          </p>
        </div>
        <h5>{news.subTitle}</h5>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: news.content }}
        ></div>
        <div className="grComment">
          <div className="oldComment">
            <div className="title">
              <CommentIcon />
              <h5>{listComments.length} Bình luận</h5>
            </div>
            <div className="listOldComment">
              {listComments.map((comment, idx) => {
                return (
                  <div key={idx + 1} className="comment">
                    <img src={comment.user.avatar} alt="" />
                    <div className="rightComment">
                      <div className="row">
                        <h4>{comment.user.username}</h4>
                        <p>
                          {moment(comment.createdAt).format(
                            "HH:mm, DD/MM/YYYY"
                          )}
                        </p>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="newComment">
            <h5>Viết bình luận</h5>
            <textarea
              name=""
              id=""
              placeholder="Hãy viết bình luận"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="grButton">
              <button onClick={handleSubmit}>Gửi</button>
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <h3>Cùng danh mục</h3>
        <div className="listSameCategory">
          {listNews.map((item, idx) => {
            return (
              <div
                key={idx + 1}
                className="item"
                onClick={() => navigate(`/news/details/${item._id}`)}
              >
                <div className="leftItem">
                  <img src={item.img} alt="" />
                </div>
                <div className="rightItem">
                  <div className="background"></div>
                  <div className="content">
                    <h5>{item.title}</h5>
                    <p>{moment(item.createdAt).format("HH:mm, DD/MM/YYYY")}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default NewsDetailPage;
