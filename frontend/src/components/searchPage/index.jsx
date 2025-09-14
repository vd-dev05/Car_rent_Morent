import { useState } from "react";
//icons
import FindIcon from "../../icons/searchPage/FindIcon";
import CarFrame1 from "../carFrame/carFrameStyle1";
//css
import "./style.css";

const SearchPage = () => {
  const [isVisible, setIsVisible] = useState(false); //hiệu ứng khi bấm vô phần thêm điều kiện để tìm xe
  const [carDataResultList, setCarDataResultList] = useState(true);

  const toggleInput = () => {
    setIsVisible(!isVisible);
    console.log("xin chào");
  };

  return (
    <div className="SearchPage">
      <div className="container1">
        <h2>Tìm kiếm chiếc xe yêu thích</h2>
        <p>- Pro car -</p>
      </div>
      <div className="container2">
        <div className="container2Left">
          <h3>Tìm theo</h3>
          <div className="line"></div>
          <div className="condition">
            <h4>Tình trạng</h4>
            <div className="selectCondition">
              <label className="custom-checkbox">
                <input type="checkbox" />
                <span className="checkmark">
                  <div className="insideCheckMark"></div>
                </span>
                Tất cả
              </label>
              <label className="custom-checkbox">
                <input type="checkbox" />
                <span className="checkmark">
                  <div className="insideCheckMark"></div>
                </span>
                Xe mới
              </label>
              <label className="custom-checkbox">
                <input type="checkbox" />
                <span className="checkmark">
                  <div className="insideCheckMark"></div>
                </span>
                Xe cũ
              </label>
            </div>
          </div>
          <div className="selectBrand">
            <h4 htmlFor="brandSelect">Hãng:</h4>
            <select id="brandSelect" name="brandSelect">
              <option>Bmw</option>
              <option>Audi</option>
              <option>Honda</option>
              <option>Toyota</option>
            </select>
          </div>
          {/* <div className="line"></div> */}
          <div className={`moreCondition ${isVisible ? "show" : "hide"}`}>
            <h4 onClick={toggleInput}>Thêm</h4>
            <div className={`inputField ${isVisible ? "show" : "hide"}`}>
              <div className="moreConditionFrame">
                <label htmlFor="">Chọn năm:</label>
                <input type="number" />
              </div>
              <div className="moreConditionFrame">
                <label htmlFor="">Chọn màu:</label>
                <input type="text" />
              </div>
              <div className="moreConditionFrame">
                <label htmlFor="">Tầm giá (vnđ):</label>
                <input type="number" />
              </div>
            </div>
          </div>
          <div className="btnSearch">
            <button>Tìm</button>
          </div>
        </div>

        <div className="container2Right">
          <div className="section1 searchCarFrame">
            <input
              type="text"
              className="FindCar"
              placeholder="Nhập tên xe bạn tìm"
            />
            <button className="btnFindSong">
              <FindIcon></FindIcon>
            </button>
          </div>
          <div className="section2 ">
            <div className="countResult">
              Kết quả: <span>8</span>
            </div>
            <div className="sortFrame">
              <div htmlFor="sortSelect">Sắp xếp:</div>
              <select id="sortSelect" name="sortSelect">
                <option>Cao đến thấp</option>
                <option>Thấp đến cao</option>
              </select>
            </div>
          </div>
          {carDataResultList ? (
            <div className="section3 CarResultList">
              <CarFrame1></CarFrame1>
              <CarFrame1></CarFrame1>
              <CarFrame1></CarFrame1>
              <CarFrame1></CarFrame1>

              <CarFrame1></CarFrame1>

              <CarFrame1></CarFrame1>

              <CarFrame1></CarFrame1>

              <CarFrame1></CarFrame1>

              <CarFrame1></CarFrame1>

              <CarFrame1></CarFrame1>

              <CarFrame1></CarFrame1>
            </div>
          ) : (
            <div>Bạn tìm xe gì</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
