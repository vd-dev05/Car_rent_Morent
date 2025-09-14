//library
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { message } from "antd";
import { useParams } from "react-router-dom";
import moment from "moment";
// store
import { Store } from "../../../Store";
//icon
import WarningIcon from "../../../icons/provider/warning";
import MailNotSeen from "../../../icons/provider/mailNotSeen";
import MailSeen from "../../../icons/provider/mailSeen";
import IconLeft from "../../../icons/categoryPage/IconLeft";
import IconRight from "../../../icons/categoryPage/IconRight";
import like from "../../../../public/imgs/like1.jpeg";
//css
import "./style.css";

const ContactMailManage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const store = useContext(Store);
  const [listMail, setListMail] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [decision, setDecision] = useState(""); // "chấp thuận" hoặc "từ chối"
  const [reason, setReason] = useState(""); // Lý do từ chối
  const [currentPage, setCurrentPage] = useState(1); //ptrang
  const [totalPages, setTotalPages] = useState(1);
  //lấy id
  const { idUser } = useParams();
  console.log(idUser);

  //
  let accessToken;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
  }
  // const crrUser = localStorage.getItem("currentUser");
  // const userObj = JSON.parse(crrUser);
  // const accessToken = userObj.accessToken;

  useEffect(() => {
    const fetchListMailData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/mail/ProviderMail?providerId=${idUser}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setListMail(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(
          "Error fetching mail data:",
          error.response?.data?.message
        );
      }
    };

    if (idUser) fetchListMailData();
  }, [idUser]);
  //Hàm xem thư
  const seenMail = async (mailId, mail) => {
    if (!mail.isRead) {
      try {
        await axios.put(
          `${API_BASE_URL}/api/v1/mail/${mailId}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // Cập nhật trạng thái thư trong danh sách
        setListMail((prevList) =>
          prevList.map((m) => (m._id === mailId ? { ...m, isRead: true } : m))
        );
      } catch (error) {
        console.error("Error marking mail as read:", error);
      }
    }
    // Hiển thị nội dung thư
    setSelectedMail(mail);
    setDecision("");
    setReason("");
  };

  // Hàm đổi status
  const handleDecision = async () => {
    if (!selectedMail) return;

    if (decision === "từ chối" && !reason.trim()) {
      message.error("Vui lòng nhập lý do từ chối!");
      return;
    }
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/mail/${selectedMail._id}/status`,
        { status: decision, reason },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      message.success(
        decision === "chấp thuận" ? "Đã chấp thuận thư!" : "Đã từ chối thư!"
      );

      // Cập nhật trạng thái thư
      setListMail((prevList) =>
        prevList.map((m) =>
          m._id === selectedMail._id ? { ...m, status: decision, reason } : m
        )
      );

      setSelectedMail((prev) => ({
        ...prev,
        status: decision,
        reason,
      }));
    } catch (error) {
      console.error("Lỗi khi gửi quyết định:", error);
      message.error("Lỗi khi gửi quyết định!");
    }
  };
  //phân trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!listMail.length) {
    return (
      <div className="noneMail">
        <p>Hiện tại bạn chưa có đơn nào của khách. </p>
        <img src={like} alt="" />
        <p>Nhưng sẽ sớm thôi bạn sẽ có những đơn hàng đầu tiên !</p>
      </div>
    );
  }

  return (
    <div className="ContactMailManage">
      <div className="container1">
        {listMail.length > 0 ? (
          listMail.map((mail) => (
            <div
              className="mailFrame"
              key={mail._id}
              onClick={() => seenMail(mail._id, mail)}
            >
              <div className="icon">
                {mail.isRead ? <MailSeen /> : <MailNotSeen />}
              </div>
              <div className="mailName">Thư từ {mail.senderName}</div>
              <div className="recivedAt">
                {moment(mail.createdAt).format("DD/MM/YYYY")}
              </div>
            </div>
          ))
        ) : (
          <>Chưa có thư</>
        )}

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
      </div>

      <div className="line"></div>

      <div className="container2">
        {selectedMail ? (
          <div className="mailContent">
            <div className="senderName">{selectedMail.senderName}</div>
            <div className="line2"></div>
            <div className="row">
              <label>Email:</label>
              <div className="senderMail">{selectedMail.senderEmail}</div>
            </div>
            <div className="row">
              <label>Số điện thoại:</label>
              <div className="senderMail">{selectedMail.senderPhone}</div>
            </div>
            <div className="row">
              <label>Xe:</label>
              <div className="senderMail">{selectedMail.carId.carName}</div>
            </div>
            <div className="row">
              <label>Hết hạn vào:</label>
              <div className="senderMail">
                {moment(selectedMail.expiresAt).format(`DD/MM/YYYY`)}
              </div>
            </div>
            <div className="frameContent">
              <div className="nameContent">Nội dung thư</div>
              <div className="content">{selectedMail.mailContent}</div>
            </div>
            <div className="line2"></div>

            {/* Nếu đã xử lý, hiển thị trạng thái */}
            {selectedMail.status === "từ chối" ||
            selectedMail.status === "chấp thuận" ? (
              <div className="statusBox">
                <strong>Trạng thái: {selectedMail.status}</strong>
                {selectedMail.status === "từ chối" && (
                  <p>Lý do từ chối: {selectedMail.reason}</p>
                )}
              </div>
            ) : (
              <>
                <div className="decisionBox">
                  <label>
                    <input
                      type="checkbox"
                      checked={decision === "chấp thuận"}
                      onChange={() => {
                        setDecision("chấp thuận");
                        setReason(""); // Xóa lý do nếu đổi sang chấp thuận
                      }}
                    />
                    Chấp thuận
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={decision === "từ chối"}
                      onChange={() => setDecision("từ chối")}
                    />
                    Từ chối
                  </label>
                </div>

                {/* Input nhập lý do nếu từ chối */}
                {decision === "từ chối" && (
                  <div className="reasonBox">
                    <label>Lý do từ chối:</label>
                    <textarea
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Nhập lý do từ chối..."
                    />
                  </div>
                )}

                {/* Button xác nhận */}
                <button onClick={handleDecision} disabled={!decision}>
                  Gửi quyết định
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="notSelectMail">
            <WarningIcon></WarningIcon>
            <div className="warningText">Nhấn vào thư để đọc</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMailManage;
