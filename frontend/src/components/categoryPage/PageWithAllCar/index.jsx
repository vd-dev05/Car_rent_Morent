//components
import CarFrame2 from "../../carFrame/carFrameStyle2";
//icons
import IconLeft from "../../../icons/categoryPage/IconLeft";
import IconRight from "../../../icons/categoryPage/IconRight";
// library
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
//css
import "./style.css";

const PageWithAllCar = () => {
  const [allCarsData, setAllCarsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const carsPerPage = 9;
  useEffect(() => {
    const fetchAllCarsData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/cars?limit=${carsPerPage}&page=${currentPage}`
        );
        setAllCarsData(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchAllCarsData();
  }, [currentPage]);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  if (!allCarsData) {
    return <div>Loading</div>;
  }
  return (
    <div className="PageWithAllCar">
      <h3 className="title">
        Có <span>{allCarsData.length}</span> xe rao bán -tất cả-
      </h3>
      <div className="listCar">
        {allCarsData || allCarsData.length ? (
          allCarsData.map((car, index) => <CarFrame2 key={index} car={car} />)
        ) : (
          <>Không có xe nào</>
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
          <IconRight></IconRight>
        </button>
      </div>
    </div>
  );
};

export default PageWithAllCar;
