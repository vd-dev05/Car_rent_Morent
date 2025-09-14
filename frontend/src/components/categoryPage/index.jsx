// svgs
import FindIcon from "../../icons/searchPage/FindIcon";
import IconLeft from "../../icons/categoryPage/IconLeft";
import IconRight from "../../icons/categoryPage/IconRight";
//components
import CarFrame2 from "../carFrame/carFrameStyle2";
import Loading from "../Loading";

//library
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

//css

import "./style.css";
const CategoryPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);

  const nav = useNavigate();
  const [allCarsData, setAllCarsData] = useState(null); // lấy data xe
  const [currentPage, setCurrentPage] = useState(1); //ptrang
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); //tìm xe bằng tên
  const [selectedPrice, setSelectedPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const priceRanges = [
    { label: "Tất cả", min: 0, max: Infinity },
    { label: "0 - 500 triệu", min: 0, max: 500000000 },
    { label: "500 triệu - 1 tỉ", min: 500000000, max: 1000000000 },
    { label: "1 tỉ - 3 tỉ", min: 1000000000, max: 3000000000 },
    { label: "3 tỉ - 5 tỉ", min: 3000000000, max: 5000000000 },
    { label: "5 tỉ - 7 tỉ", min: 5000000000, max: 7000000000 },
    { label: "7 tỉ - 10 tỉ", min: 7000000000, max: 10000000000 },
    { label: "10 tỉ - 15 tỉ", min: 10000000000, max: 15000000000 },
    { label: "15 tỉ - 20 tỉ", min: 15000000000, max: 20000000000 },
  ]; //Bảng quy đổi
  const [filters, setFilters] = useState({
    brand: "",
    state: "",
    color: "",
    year: "",
    price: "",
  });
  const carsPerPage = 9; // limit
  const fetchAllCarsData = async () => {
    const queryParams = new URLSearchParams({
      //color=...&year=....
      limit: carsPerPage,
      page: currentPage,
      // carName: searchQuery,
      ...filters,
    }).toString();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/cars?${queryParams}`
      );
      setAllCarsData(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchAllCarsData();
  }, [filters, currentPage]);

  //hàm này để cập nhật filters mới
  /*
    Khi mà chọn filter giá (key = "price") -> đối chiếu giá trị đổi ra số (vdu: 500tr -> 500000000) bằng priceRanges
  */
  const updateFilter = (key, value) => {
    //
    setSearchQuery("");
    const newFilters = { ...filters };
    if (key === "price") {
      const selectedRange = priceRanges.find(
        (range) => range.label === value.trim() //
      );
      if (selectedRange) {
        newFilters.minPrice = selectedRange.min; //thêm vô filter
        newFilters.maxPrice = selectedRange.max;
      } else {
        //else là trường hợp "Tất cả" -> filter price = " "
        delete newFilters.minPrice;
        delete newFilters.maxPrice;
      }
    } else {
      newFilters[key] = value; //Các filters khác
    }
    setSelectedPrice(value.trim());
    setFilters(newFilters);
    setCurrentPage(1);
    const queryParams = new URLSearchParams({
      ...newFilters,
      page: 1, //Chuyển về trang đầu tiên
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/cars/search?carName=${searchQuery}&limit=${carsPerPage}&page=${currentPage}`
      );
      setAllCarsData(response.data.data);
      setTotalPages(response.data.totalPages); // Nếu API trả kết quả đầy đủ trong 1 trang
      setCurrentPage(1);
      setSelectedPrice("");
    } catch (error) {
      console.error("Error searching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  if (!allCarsData) {
    return <Loading></Loading>;
  }
  //Phần chọn brand xe
  const listBrand = [
    "Tất cả",
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
  const listColor = [
    "Tất cả",
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
    "Tất cả",
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
  const listPrice = [
    "Tất cả",
    "0 - 500 triệu",
    "500 triệu - 1 tỉ",
    "1 tỉ - 2 tỉ",
    "3 tỉ - 5 tỉ ",
    "5 tỉ - 7 tỉ ",
    "7 tỉ - 10 tỉ ",
    "10 tỉ - 15 tỉ ",
    "15 tỉ - 20 tỉ ",
  ];
  return (
    <div className="allCarPage">
      <div className="container1">
        <div className="section0 searchCarFrame">
          <input
            type="text"
            className="FindCar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm xe theo tên"
          />
          <button className="btnFindSong" onClick={handleSearch}>
            <FindIcon></FindIcon>
          </button>
        </div>
        <div className="sortsCarByBrand section1 section">
          <div className="title">Theo hãng xe:</div>
          <div className="list">
            {listBrand.map((brand) => (
              <div
                key={brand}
                className={`brandCar item ${
                  filters.brand === brand ? "active" : ""
                }`}
                onClick={() =>
                  updateFilter("brand", brand === "Tất cả" ? "" : brand)
                }
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
        <div className="section2 section">
          <div className="title">Theo trạng thái:</div>
          <div className="stateList list">
            {["Tất cả", "Cũ", "Mới"].map((state) => (
              <div
                key={state}
                className={`carState item ${
                  filters.state === state ? "active" : ""
                }`}
                onClick={() =>
                  updateFilter("state", state === "Tất cả" ? "" : state)
                }
              >
                {state}
              </div>
            ))}
          </div>
        </div>
        <div className="section3 section">
          <div className="title">Theo màu sắc:</div>
          <div className="list colorList">
            {listColor.map((color) => (
              <div
                className={`carColor item ${
                  filters.color === color ? "active" : ""
                }`}
                key={color}
                onClick={() =>
                  updateFilter("color", color === "Tất cả" ? "" : color)
                }
              >
                {color}
              </div>
            ))}
          </div>
        </div>
        <div className="section4 section">
          <div className="title">Theo năm:</div>
          <div className="list yearList">
            {listYear.map((year) => (
              <div
                className={`year item ${filters.year === year ? "active" : ""}`}
                key={year}
                onClick={() =>
                  updateFilter("year", year === "Tất cả" ? "" : year)
                }
              >
                {year}
              </div>
            ))}
          </div>
        </div>
        <div className="section5 section">
          <div className="title">Theo giá:</div>
          <div className="list priceList">
            {priceRanges.map((range) => (
              <div
                key={range.label}
                className={`price item ${
                  selectedPrice === range.label ? "active" : ""
                }`}
                onClick={() =>
                  updateFilter(
                    "price",
                    range.label === "Tất cả" ? "" : range.label
                  )
                }
              >
                {range.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="PageWithAllCar container2">
        <h3 className="title">
          Có <span>{allCarsData.length}</span> xe rao bán
        </h3>
        <div className="listCar">
          {allCarsData && allCarsData.length > 0 ? (
            allCarsData.map((car, index) => <CarFrame2 key={index} car={car} />)
          ) : (
            <div>Không có xe nào</div>
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
      </div>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default CategoryPage;
{
  /* <div className="compareBtn">
  <div className="title">So sánh</div>
  <input type="checkbox" id="checkboxInput" />
  <label for="checkboxInput" className="toggleSwitch"></label>
</div> */
}
