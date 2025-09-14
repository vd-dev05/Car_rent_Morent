import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { message } from "antd";
//
import Loading from "../../Loading";
import "./style.css";

const NewsOverview = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [listCarNews, setListCarNews] = useState([]);
  const [listMarketNews, setListMarketNews] = useState([]);
  const [listExplore, setListExplore] = useState([]);
  const queryAllNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/news/the3LatestNewsPerCategory`
      );
      setListCarNews(response.data.dataListCarNews);
      setListMarketNews(response.data.dataListMarketNews);
      setListExplore(response.data.dataListExplore);
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
    queryAllNews();
  }, []);
  return (
    <div className="newsOverview">
      <div className="grListNews">
        <h2>Tin xe</h2>
        <div className="listByCategory">
          {listCarNews.map((news, index) => {
            return (
              <div
                key={index + 1}
                className={`news news${index + 1}`}
                onClick={() => navigate(`/news/details/${news._id}`)}
              >
                <img src={news.img} alt="" />
                <div className="content">
                  <h4>{news.title}</h4>
                  <div className="row">
                    <h5>Tin xe</h5>
                    <p>
                      • {moment(news.createdAt).format("HH:mm, DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grListNews">
        <h2>Tin thị trường</h2>
        <div className="listByCategory">
          {listMarketNews.map((news, index) => {
            return (
              <div
                key={index + 1}
                className={`news news${index + 1}`}
                onClick={() => navigate(`/news/details/${news._id}`)}
              >
                <img src={news.img} alt="" />
                <div className="content">
                  <h4>{news.title}</h4>
                  <div className="row">
                    <h5>Tin thị trường</h5>
                    <p>
                      • {moment(news.createdAt).format("HH:mm, DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grListNews">
        <h2>Khám phá</h2>
        <div className="listByCategory">
          {listExplore.map((news, index) => {
            return (
              <div
                key={index + 1}
                className={`news news${index + 1}`}
                onClick={() => navigate(`/news/details/${news._id}`)}
              >
                <img src={news.img} alt="" />
                <div className="content">
                  <h4>{news.title}</h4>
                  <div className="row">
                    <h5>Khám phá</h5>
                    <p>
                      • {moment(news.createdAt).format("HH:mm, DD/MM/YYYY")}
                    </p>
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

export default NewsOverview;
