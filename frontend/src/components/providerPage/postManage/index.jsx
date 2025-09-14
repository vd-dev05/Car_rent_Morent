// store
import { Store } from "../../../Store";
// components
import CarFrame1 from "../../carFrame/carFrameStyle1";
import EditPostProviderModal from "./EditModal";
//icons
import EditIcon from "../../../icons/provider/EditIcon";
import BinIcon from "../../../icons/provider/BinIcon";
import carImg from "../../../../public/imgs/carImg.png";
//library
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd"; //Thông báo

//css
import "./style.css";
const PostManage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { idUser } = useParams();
  const store = useContext(Store);
  //phần edit
  const [onOpenEditModal, setOnOpenEditModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  //Phần delete
  const [selectedCarToDelete, setSelectedCarToDelete] = useState(null);
  //xe của provider
  const [providerCar, setProviderCar] = useState([]);
  //Lấy token
  let accessToken;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
  }
  // const crrUser = localStorage.getItem("currentUser");
  // const userObj = JSON.parse(crrUser); // Chuyển chuỗi JSON thành object
  // const accessToken = userObj.accessToken;

  //hàm mở modal sửa thông tin
  const openEditModal = (car) => {
    setSelectedCar(car);
    setOnOpenEditModal(true);
  };

  // Hàm mở modal xóa xe, chỉ mở modal của đúng xe đó
  const openDeleteModal = (carId) => {
    setSelectedCarToDelete(carId === selectedCarToDelete ? null : carId);
  };
  //Gọi Api lấy tất cả xe của User;
  const fetchApi = async () => {
    try {
      const responseCarData = await axios.get(
        `${API_BASE_URL}/api/v1/cars/${idUser}`
      );
      setProviderCar(responseCarData.data.data || []);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setProviderCar([]);
    }
  };

  //Api xóa bài đăng
  const fetchApiDeleteCar = async (idCar) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/cars/deletecar/${idCar}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success("Xóa tin đăng bán thành công");
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      message.error(error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [idUser, providerCar]);

  // if (!providerCar.length) {
  //   return <div>Chưa có xe nào</div>;
  // }

  return (
    <div className="PostProviderManage">
      {providerCar && providerCar.length > 0 ? (
        providerCar.map((car, index) => {
          return (
            <div className="item" key={index}>
              <CarFrame1 car={car}></CarFrame1>
              <div className="actionFrame">
                <div className="editBtn btn" onClick={() => openEditModal(car)}>
                  <EditIcon></EditIcon>
                </div>
                <div className="line"></div>
                <div
                  className="deleteBtn btn"
                  onClick={() => openDeleteModal(car._id)}
                >
                  {" "}
                  <BinIcon></BinIcon>
                </div>
              </div>
              {selectedCarToDelete === car._id && (
                <div className="DeletePostProviderModal">
                  <div className="title">Bạn có thực sự muốn xóa bài đăng</div>
                  <div className="deleteActionFrame">
                    <div
                      className="acceptBtn"
                      onClick={() => fetchApiDeleteCar(car._id)}
                    >
                      Có
                    </div>
                    /
                    <div
                      className="rejectBtn"
                      onClick={() => openDeleteModal(null)}
                    >
                      Không
                    </div>
                  </div>
                </div>
              )}
              {onOpenEditModal && selectedCar && (
                <EditPostProviderModal
                  setOnOpenEditModal={setOnOpenEditModal}
                  car={selectedCar}
                  openEditModal={() => setOnOpenEditModal(false)}
                />
              )}
            </div>
          );
        })
      ) : (
        <div className="nonePost">
          <p>Hiện tại bạn đang chưa đăng bán chiếc xe nào !</p>
          <img src={carImg} alt="" />
          <p>
            Hãy đăng bán để có thể nhanh chóng bán được chiếc xe mà bạn muốn bán
            nào !
          </p>
        </div>
      )}
    </div>
  );
};

export default PostManage;
