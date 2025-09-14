import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import moment from "moment";
import axios from "axios";
import { message } from "antd";
// Store
import { Store } from "../../../../Store";
//
import Loading from "../../../Loading";
import "./style.css";

const listBrand = [
  "Audi",
  "BMW",
  "Ford",
  "Honda",
  "Mazda",
  "Mercedes",
  "Mitsubishi",
  "Nissan",
  "Subaru",
  "Toyota",
  "Vinfast",
  "Volvo",
];
const listColor = [
  "Đen",
  "Trắng",
  "Ghi",
  "Xám",
  "Đỏ",
  "Xanh lá",
  "Xanh dương",
  "Xanh Sodalite",
  "Nâu",
  "Vàng",
  "Tím",
  "Cam",
];
const listYear = [
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
];

const EditCarInfo = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const store = useContext(Store);
  let accessToken;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
  }
  // màn hình hiển thị ở đầu trang khi mở trang lên, thiết lập thanh cuộn trên đầu trang
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // queryCarInfo
  const { id } = useParams();
  // thông tin cơ bản
  const [carImg, setCarImg] = useState([]);
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [brand, setBrand] = useState("");
  // tổng quan
  const [version, setVersion] = useState("");
  const [year, setYear] = useState("");
  const [state, setState] = useState("");
  const [origin, setOrigin] = useState("");
  const [color, setColor] = useState("");
  const [sitChairs, setSitChairs] = useState("");
  const [ODO, setODO] = useState("");
  // thông số chi tiết
  const [gearBox, setGearBox] = useState(""); // hộp số
  const [driveSystem, setDriveSystem] = useState(""); // hệ dẫn động
  const [torque, setTorque] = useState(""); // momen xoắn
  const [engine, setEngine] = useState(""); // động cơ
  const [horsePower, setHorsePower] = useState(""); // mã lực
  const [power, setPower] = useState(""); // năng lượng (nhiên liệu)
  // miêu tả
  const [describe, setDescribe] = useState("");
  const queryCarInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/cars/car/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const info = response.data.data;
      //
      setCarImg(info.carImg);
      setCarName(info.carName);
      setCarPrice(info.carPrice);
      setBrand(info.brand);
      //
      setVersion(info.version);
      setYear(info.year);
      setState(info.state);
      setOrigin(info.origin);
      setColor(info.color);
      setSitChairs(info.sitChairs);
      setODO(info.ODO);
      //
      setGearBox(info.gearBox);
      setDriveSystem(info.driveSystem);
      setTorque(info.torque);
      setEngine(info.engine);
      setHorsePower(info.horsePower);
      setPower(info.power);
      //
      setDescribe(info.describe);
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
    queryCarInfo();
  }, []);
  // submit
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const payloadFormData = new FormData();
    payloadFormData.append("brand", brand);
    payloadFormData.append("carPrice", carPrice);
    payloadFormData.append("version", version);
    payloadFormData.append("year", year);
    payloadFormData.append("state", state);
    payloadFormData.append("origin", origin);
    payloadFormData.append("color", color);
    payloadFormData.append("sitChairs", sitChairs);
    payloadFormData.append("ODO", ODO);
    payloadFormData.append("gearBox", gearBox);
    payloadFormData.append("driveSystem", driveSystem);
    payloadFormData.append("torque", torque);
    payloadFormData.append("engine", engine);
    payloadFormData.append("horsePower", horsePower);
    payloadFormData.append("power", power);
    payloadFormData.append("describe", describe);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/cars/updatecar/${id}`,
        payloadFormData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // "Content-type": "multipart/form-data",
            "Content-type": "application/json",
          },
        }
      );
      message.loading("Đang cập nhật!", 1).then(() => {
        message.success(response.data.message, 2);
        setLoading(false);
        // navigate('/admin/cars/all');
        window.history.back();
      });
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
      setLoading(false);
    }
  };
  return (
    <div className="editCarInfo">
      <h3>Chỉnh sửa thông tin xe</h3>
      <div className="grCarImg">
        <h4>Ảnh xe</h4>
        <div className="carImg">
          {carImg.map((img, idx) => {
            return (
              <img
                src={img}
                alt=""
                key={idx + 1}
                className={`carImg${idx + 1}`}
              />
            );
          })}
        </div>
        <i>* Không thể chỉnh sửa ảnh</i>
      </div>
      <div className="grBaseInfo">
        <h4>Thông tin cơ bản</h4>
        <div className="baseInfo">
          <div className="grCarName">
            <label htmlFor="carName">Tên xe</label>
            <input
              type="text"
              id="carName"
              disabled
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
            />
            <i>* Không thể chỉnh sửa tên xe</i>
          </div>
          <div className="grBrand">
            <label htmlFor="brand">Tên hãng</label>
            <select
              name="brand"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="" disabled>
                ---------- Chọn hãng ----------
              </option>
              {listBrand.map((brand, idx) => (
                <option key={idx} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div className="grCarPrice">
            <label htmlFor="carPrice">Giá xe</label>
            <input
              type="number"
              id="carPrice"
              placeholder="100000000 (100.000.000vnđ)"
              value={carPrice}
              onChange={(e) => setCarPrice(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="grOverview">
        <h4>Tổng quan</h4>
        <div className="overview">
          <div className="grVersion">
            <label htmlFor="version">Phiên bản</label>
            <input
              type="text"
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>
          <div className="grYear">
            <label htmlFor="year">Năm sản xuất</label>
            <select
              name="year"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" disabled>
                ---------- Chọn năm sản xuất ----------
              </option>
              {listYear.map((year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="grState">
            <label htmlFor="state">Tình trạng</label>
            <select
              name="state"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="" disabled>
                ---------- Chọn tình trạng ----------
              </option>
              <option value="Cũ">Cũ</option>
              <option value="Mới">Mới</option>
            </select>
          </div>
          <div className="grOrigin">
            <label htmlFor="origin">Xuất sứ</label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          <div className="grColor">
            <label htmlFor="color">Màu sắc</label>
            <select
              name="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="" disabled>
                ---------- Chọn màu ----------
              </option>
              {listColor.map((color, idx) => (
                <option key={idx} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div className="grSitChairs">
            <label htmlFor="sitChairs">Số ghế</label>
            <input
              type="number"
              id="sitChairs"
              value={sitChairs}
              onChange={(e) => setSitChairs(e.target.value)}
            />
          </div>
          <div className="grODO">
            <label htmlFor="ODO">Số KM đã đi</label>
            <input
              type="number"
              id="ODO"
              value={ODO}
              onChange={(e) => setODO(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="grDetailedParameters">
        <h4>Thông số chi tiết</h4>
        <div className="detailedParameters">
          <div className="grGearBox">
            <label htmlFor="gearBox">Hộp số</label>
            <select
              name="gearBox"
              id="gearBox"
              value={gearBox}
              onChange={(e) => setGearBox(e.target.value)}
            >
              <option value="" disabled>
                ---------- Chọn hộp số ----------
              </option>
              <option value="Số tự động">Số tự động</option>
              <option value="Số sàn">Số sàn</option>
            </select>
          </div>
          <div className="grDriveSystem">
            <label htmlFor="driveSystem">Hệ dẫn động</label>
            <input
              type="text"
              id="driveSystem"
              value={driveSystem}
              onChange={(e) => setDriveSystem(e.target.value)}
            />
          </div>
          <div className="grTorque">
            <label htmlFor="torque">Momen xoắn</label>
            <input
              type="text"
              id="torque"
              value={torque}
              onChange={(e) => setTorque(e.target.value)}
            />
          </div>
          <div className="grEngine">
            <label htmlFor="engine">Động cơ</label>
            <input
              type="text"
              id="engine"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
            />
          </div>
          <div className="grHorsePower">
            <label htmlFor="horsePower">Mã lực</label>
            <input
              type="text"
              id="horsePower"
              value={horsePower}
              onChange={(e) => setHorsePower(e.target.value)}
            />
          </div>
          <div className="grPower">
            <label htmlFor="power">Năng lượng</label>
            <input
              type="text"
              id="power"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="grDescribe">
        <h4 htmlFor="describe">Miêu tả</h4>
        <textarea
          name=""
          id="describe"
          placeholder="Viết miêu tả"
          value={describe}
          onChange={(e) => setDescribe(e.target.value)}
        ></textarea>
      </div>
      <div className="grButton">
        <button onClick={handleSubmit}>Cập nhật</button>
        <button onClick={() => window.history.back()}>Quay lại</button>
      </div>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default EditCarInfo;
