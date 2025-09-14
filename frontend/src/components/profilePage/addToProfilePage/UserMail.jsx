import { io } from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
//icons
import MailAcceptedIcon from "../../../icons/usermail/mailAccepted";
import MailSeenIconUser from "../../../icons/usermail/mailSeen";
import MailReJectedIcon from "../../../icons/usermail/mailRejected";
import MailSend from "../../../icons/usermail/mailSend";
import IconLeft from "../../../icons/categoryPage/IconLeft";
import IconRight from "../../../icons/categoryPage/IconRight";
//loading
import Loading from "../../Loading";
//css
import "./UserMail.css";
import imgMail from "../../../../public/imgs/imgmail.jpeg";
import { Store } from "../../../Store";

const MailPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const [loading, setLoading] = useState(false);
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [selectedDeleteMail, setSelectedDeleteMail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); //ptrang
  const [totalPages, setTotalPages] = useState(1);
  const store = useContext(Store);
  const nav = useNavigate();
  const { userId } = useParams();

  if (store.currentUser._id !== userId) {
    nav(`/profile/email/${store.currentUser._id}`);
  }
  console.log(store.currentUser);
  useEffect(() => {
    const fetchUserMailData = async () => {
      setLoading(true);
      // e.preventDefault();
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/mail/SenderMail?userId=${userId}&page=${currentPage}`
        );
        setMails(response.data.data);
        setTotalPages(response.data.totalPages);
        console.log(response.data.data);
      } catch (error) {
        console.log(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserMailData();
  }, [userId]);
  if (!mails) {
    return <Loading></Loading>;
  }
  if (!mails.length) {
    return (
      <div className="noneMail">
        <p>Hiện tại bạn chưa gửi đơn nào cả.</p>
        <img src={imgMail} alt="" />
        <p>
          Hãy gửi đơn cho người bán để có thể sở hữu được chiếc xe mà bạn mong
          muốn.
        </p>
      </div>
    );
  }

  const checkReason = (mail) => {
    setSelectedMail(mail);
  };

  const closeModal = () => {
    setSelectedMail(null);
  };
  //hàm mở modal xóa
  const openDeleteMailModal = (mailId) => {
    setSelectedDeleteMail(mailId === selectedDeleteMail ? null : mailId);
  };

  //api xóa đơn đã gửi
  const handleDeleteMail = async (mailId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/mail/deleteMail/${mailId}`,
        {
          headers: {
            Authorization: `Bearer ${store.currentUser.accessToken}`,
          },
        }
      );
      message.success(response.data.message);
      // Cập nhật lại danh sách mails, loại bỏ mail vừa xóa
      setMails((prevMails) => prevMails.filter((mail) => mail._id !== mailId));
    } catch (error) {
      console.log(error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  //phân trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  return (
    <div className="MailPage">
      <div className="email">
        <h3>
          Bạn đã gửi <span>{mails.length}</span> đơn
        </h3>
        <div className="listMail">
          {mails && mails.length > 0 ? (
            mails.map((mail, index) => (
              <div className="mailFrame" key={mail._id}>
                <div className="section1">
                  <gr>
                    <label htmlFor="">Tên xe</label>
                    {mail.carId.carName ? (
                      <div className="nameCar">{mail.carId.carName}</div>
                    ) : (
                      <>Hello</>
                    )}
                    {/* <div className="nameCar">{mail.carId.carName}</div> */}
                  </gr>
                  <gr>
                    <label htmlFor="">Hết hạn vào</label>
                    <div className="expiredAd">
                      {" "}
                      {moment(mail.expiresAt).format("DD/MM/YYYY")}
                    </div>
                  </gr>
                </div>
                {mail.status.trim() === "chấp thuận" && (
                  <div className="section2">
                    <div className="statusIcon">
                      <MailAcceptedIcon></MailAcceptedIcon>
                    </div>
                    <div className="status">Người bán sẽ sớm liên hệ</div>
                  </div>
                )}
                {/* Nếu từ chối */}
                {mail.status.trim() === "từ chối" && (
                  <div className="section2">
                    <div className="statusIcon">
                      <MailReJectedIcon></MailReJectedIcon>
                    </div>
                    <div className="status">Người bán đã từ chối</div>
                    <div className="toReason" onClick={() => checkReason(mail)}>
                      Xem lí do{" "}
                    </div>
                  </div>
                )}
                {mail.status.trim() === "đang xử lý" &&
                  mail.isRead === false && (
                    <div className="section2">
                      <div className="statusIcon">
                        <MailSend></MailSend>
                      </div>
                      <div className="status">Người bán chưa xem...</div>
                    </div>
                  )}
                {mail.status.trim() === "đã xem" && mail.isRead === true && (
                  <div className="section2">
                    <div className="statusIcon">
                      <MailSeenIconUser></MailSeenIconUser>
                    </div>
                    <div className="status">Người bán đã xem</div>
                  </div>
                )}
                <div className=" section3">
                  <p
                    className="openDeleteFrame"
                    onClick={() => openDeleteMailModal(mail._id)}
                  >
                    Hủy đơn
                  </p>
                  {selectedDeleteMail === mail._id && (
                    <div className="deleteFrame">
                      <div className="title">Bạn có thực sự muốn hủy đơn ?</div>
                      <div className="actionFrame">
                        <div
                          className="accept"
                          onClick={() => handleDeleteMail(mail._id)}
                        >
                          Có
                        </div>{" "}
                        /{" "}
                        <div
                          className="reject"
                          onClick={() => openDeleteMailModal(null)}
                        >
                          Không
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <div className="deleteFrame">
                      <div className="title">Bạn có thực sự muốn hủy đơn ?</div>
                      <div className="actionFrame">
                        <div className="accept">Có</div> /{" "}
                        <div className="reject">Không</div>
                      </div>
                    </div> */}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        {selectedMail ? (
          <div className="reasonFrame">
            <div className="modal">
              <div className="ReasonModalheader">
                <h3 className="title">Thư bị từ chối</h3>

                <div className="closeModal" onClick={closeModal}>
                  X
                </div>
              </div>
              <div className="ReasonModalcontent">
                <div className="title">Lí do</div>
                <textarea name="" id="" value={selectedMail.reason}></textarea>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IconLeft></IconLeft>
        </button>
        <span>
          Trang {currentPage}/{totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IconRight style={{ width: "20", height: "20" }}></IconRight>
        </button>
      </div>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default MailPage;
