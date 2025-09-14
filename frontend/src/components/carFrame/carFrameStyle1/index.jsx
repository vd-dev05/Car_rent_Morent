//Frame xe dạng nằm ngang
//icons
import CalendarIcon from "../../../icons/CarFrame/CarlendarIcon";
import EnergyIcon from "../../../icons/CarFrame/EnergyIcon";
import SittingChairIcon from "../../../icons/CarFrame/SittingChair";
import WheelIcon from "../../../icons/CarFrame/Wheelcon";
//css
import "./style.css";
const CarFrame1 = ({ car }) => {
  return (
    //viết tên loằng ngoằng để không trùng cái đã có
    <div className="CarFrameComponent1">
      <div className="carImg">
        <img src={car.carImg[0]} alt={car.carName} />
      </div>
      <div className="carInfo">
        <div className="nameCar">{car.carName}</div>
        <div className="Price">
          VNĐ: <span>{car.carPrice.toLocaleString()}</span>
        </div>
        <div className="BrandAndCountry">
          {car.brand}, <span>{car.origin}</span>
        </div>
        {/* thông số */}
        <div className="parameter">
          <div className="parameterFrame">
            <CalendarIcon></CalendarIcon>
            <div className="title">{car.year}</div>
          </div>
          <div className="parameterFrame">
            <WheelIcon></WheelIcon>
            <div className="title">{car.gearBox}</div>
          </div>
          <div className="parameterFrame">
            <EnergyIcon></EnergyIcon>
            <div className="title">{car.power}</div>
          </div>
          <div className="parameterFrame">
            <SittingChairIcon></SittingChairIcon>
            <div className="title">{car.sitChairs}</div>
          </div>
        </div>
        <div className="line"></div>
      </div>
    </div>
  );
};

export default CarFrame1;
