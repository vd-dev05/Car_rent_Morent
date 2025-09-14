// library
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//components
import CarFrame2 from "../../carFrame/carFrameStyle2";
//css
import "./style.css";

const PageWithCarByBrand = () => {
  const { brand } = useParams();
  const [carDataByBrand, setCarDataByBrand] = useState(null);
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/cars/brand?brand=${brand}`
        );
        setCarDataByBrand(response.data.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchCarData();
  }, [brand]);
  if (!carDataByBrand) {
    return <div>Loading...</div>;
  }
  return (
    <div className="PageWithCarByBrand">
      <h3 className="title">
        Có <span>{carDataByBrand.length}</span> xe rao bán -{brand}-
      </h3>
      <div className="listCar">
        {carDataByBrand || carDataByBrand.length ? (
          carDataByBrand.map((car, index) => (
            <CarFrame2 key={index} car={car} />
          ))
        ) : (
          <>Không có xe nào</>
        )}
      </div>
    </div>
  );
};

export default PageWithCarByBrand;
