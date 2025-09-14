import { useState } from "react";
import axios from "axios";
import { message } from "antd"; //Thông báo

//
import "./style.css";

const listBrand = [
  "Honda",
  "Mitsubishi",
  "Vinfast",
  "Toyota",
  "Nissan",
  "Volvo",
  "Mazda",
  "Ford",
  "Subaru",
  "Mercedes",
  "Audi",
  "BMW",
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

const EditPostProviderModal = ({ openEditModal, car, setOnOpenEditModal }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const [carPrice, setCarPrice] = useState(car.carPrice || "");
  const [brand, setBrand] = useState(car.brand || listBrand[0]);
  const [color, setColor] = useState(car.color || listColor[0]);
  const [sitChairs, setSitChairs] = useState(car.sitChairs || "");
  const [state, setState] = useState(car.state || "Mới");
  const [ODO, setODO] = useState(car.ODO || "");
  const [origin, setOrigin] = useState(car.origin || "");
  const [year, setYear] = useState(car.year || listYear[0]);
  const [version, setVersion] = useState(car.version || "");
  const [gearBox, setGearBox] = useState(car.gearBox || "Số tự động");
  const [driveSystem, setDriveSystem] = useState(car.driveSystem || "");
  const [torque, setTorque] = useState(car.torque || "");
  const [engine, setEngine] = useState(car.engine || "");
  const [horsePower, setHorsePower] = useState(car.horsePower || "");
  const [power, setPower] = useState(car.power || "Xăng");
  const [describe, setDescribe] = useState(car.describe || "");
  //Lấy token
  const crrUser = localStorage.getItem("currentUser");
  const userObj = JSON.parse(crrUser); // Chuyển chuỗi JSON thành object
  const accessToken = userObj.accessToken;
  const idUser = userObj._id;
  // Hàm gửi dữ liệu cập nhật lên API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!carPrice) {
      message.warning("Giá xe là bắt buộc");
      return;
    }

    const updatedCar = {
      carPrice,
      brand,
      color,
      sitChairs,
      state,
      ODO,
      origin,
      year,
      version,
      gearBox,
      driveSystem,
      torque,
      engine,
      horsePower,
      power,
      describe,
    };

    try {
      console.log(accessToken);

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/cars/updatecar/${car._id}`,
        updatedCar,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success("Cập nhật thành công");
      setOnOpenEditModal(false);
    } catch (error) {
      console.error("Lỗi cập nhật xe:", error.response.data.message);
      message.error(error);
    }
  };

  return (
    <div className="EditPostProviderModal">
      <div className="modal">
        <div className="EditPostProviderheader">
          <div className="nameCar">
            <h2>{car.carName}</h2>
            <div>(Tên và ảnh xe không thể thay thế)</div>
          </div>
          <div className="closeModal" onClick={openEditModal}>
            X
          </div>
        </div>
        <form action="" className="editInfoForm" onSubmit={handleSubmit}>
          <div className="section1 section">
            <div className="sq">
              <label htmlFor="Price">Giá</label>
              <input
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                type="number"
                id="Price"
                placeholder="100000000 (100.000.000vnđ)"
              />
            </div>
            <div className="sq">
              <label htmlFor="brand">Thương hiệu</label>

              <select
                name=""
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {listBrand.map((brand, index) => (
                  <option value={brand} key={index}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="sq">
              <label htmlFor="color">Màu sắc</label>

              <select
                name=""
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                {listColor.map((color, index) => (
                  <option value={color} key={index}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="sq">
              <label htmlFor="sitChairs">Ghế</label>
              <input
                type="number"
                id="sitChairs"
                placeholder="Số ghế"
                value={sitChairs}
                onChange={(e) => setSitChairs(e.target.value)}
              />
            </div>
            <div className="sq">
              <label htmlFor="state">Trạng thái</label>

              <select
                name=""
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {["Cũ", "Mới"].map((state, index) => (
                  <option value={state} key={index}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="sq">
              <label htmlFor="ODO">Số Km</label>
              <input
                type="number"
                value={ODO}
                onChange={(e) => setODO(e.target.value)}
                id="ODO"
                placeholder="100000 (100.000 Km)"
              />
            </div>
            <div className="sq">
              <label htmlFor="origin">Xuất xứ</label>
              <input
                type="text"
                id="origin"
                placeholder="Nước"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <div className="sq">
              <label htmlFor="year">Năm</label>
              <select
                name=""
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {listYear.map((y, index) => (
                  <option key={index} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="section2 section">
            <div className="sq">
              <label htmlFor="gearBox">Hộp số</label>
              <select
                name=""
                id="gearBox"
                value={gearBox}
                onChange={(e) => setGearBox(e.target.value)}
              >
                {["Số tự động", "Số sàn"].map((y, index) => (
                  <option key={index} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="sq">
              <label htmlFor="driveSystem">Hệ dẫn động</label>
              <input
                value={driveSystem}
                onChange={(e) => setDriveSystem(e.target.value)}
                type="text"
                id="driveSystem"
                placeholder="Dẫn động"
              />
            </div>
            <div className="sq">
              <label htmlFor="torque">Momen xoắn</label>
              <input
                value={torque}
                onChange={(e) => setTorque(e.target.value)}
                type="text"
                id="torque"
                placeholder="Momen"
              />
            </div>
            <div className="sq">
              <label htmlFor="engine">Động cơ</label>
              <input
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                type="text"
                id="engine"
                placeholder="Động cơ"
              />
            </div>
            <div className="sq">
              <label htmlFor="horsePower">Mã lực</label>
              <input
                value={horsePower}
                onChange={(e) => setHorsePower(e.target.value)}
                type="text"
                id="horsePower"
                placeholder="Mã lực"
              />
            </div>
            <div className="sq">
              <label htmlFor="power">Năng lượng</label>
              <input
                value={power}
                onChange={(e) => setPower(e.target.value)}
                type="text"
                id="power"
                placeholder="Nguyên liệu"
              />
            </div>
          </div>
          <div className="sq describe">
            <label htmlFor="describe">Miêu tả chi tiết</label>
            <textarea
              value={describe}
              onChange={(e) => setDescribe(e.target.value)}
              id="describe"
              placeholder="Viết gì đó"
            ></textarea>
          </div>
          <button type="submit">Gửi</button>
        </form>
      </div>
    </div>
  );
};

export default EditPostProviderModal;
