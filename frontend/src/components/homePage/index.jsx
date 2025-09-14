import { useState, useEffect } from 'react';
import Loading from '../Loading';
// imgs
import Background from "/public/imgs/background.png";
import Laptop from "/public/imgs/homePage/laptop.png";
// svgs
import ArrowRightIcon from "../../icons/homePage/ArrowRightIcon";
import CustomerIcon from "../../icons/homePage/CustomerIcon";
import PartnerIcon from "../../icons/homePage/PartnerIcon";
import CarIcon from "../../icons/homePage/CarIcon";
import AwardIcon from "../../icons/homePage/AwardIcon";
import NewCarIcon from "../../icons/homePage/NewCarIcon";
import UsedCarIcon from "../../icons/homePage/UsedCarIcon";
import ContactPartnerIcon from "../../icons/homePage/ContactPartnerIcon";
// library
import { useNavigate } from "react-router-dom";
//
import "./style.css";

const HomePage = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="homePage">
      <section className="section1">
        <img src={Background} alt="" />
        <div className="content">
          <p
            style={{
              fontSize: "70px",
              fontFamily: "Courier New",
              color: "#FFFFFF",
            }}
          >
            Drive Of Your Life
          </p>
          <div className="redirectToCategory" onClick={() => nav(`/allCars`)}>
            <h3>Tìm kiếm chiếc xe yêu thích của bạn</h3>
            <ArrowRightIcon
              style={{ width: "40px", height: "40px", fill: "none" }}
            />
          </div>
        </div>
      </section>
      <section className="section2">
        <h1>Về chúng tôi</h1>
        <p>
          Chúng tôi tự hào là một trong những hệ thống bán xe chuyên nghiệp và
          uy tín hàng đầu tại Việt Nam
        </p>
        <div className="aboutUs">
          <div className="item">
            <div>
              <h2>888</h2>
              <p>Xe đã bán</p>
            </div>
            <CarIcon />
          </div>
          <div className="item">
            <div>
              <h2>888</h2>
              <p>Khách Hàng</p>
            </div>
            <CustomerIcon />
          </div>
          <div className="item">
            <div>
              <h2>888</h2>
              <p>Đối tác</p>
            </div>
            <PartnerIcon />
          </div>
          <div className="item">
            <div>
              <h2>888</h2>
              <p>Giải thưởng</p>
            </div>
            <AwardIcon />
          </div>
        </div>
      </section>
      <section className="section3">
        <h1>Dịch vụ</h1>
        <p>Chúng tôi cung cấp các dịch vụ phù hợp với từng nhu cầu</p>
        <div className="ourServices">
          <div className="item">
            <h3>Xe Mới</h3>
            <div>
              <NewCarIcon />
            </div>
            <p>Cung cấp những mẫu xe nhập nguyên chiếc từ hãng</p>
          </div>
          <div className="item">
            <h3>Xe Cũ</h3>
            <div>
              <UsedCarIcon />
            </div>
            <p>Cung cấp những chiếc xe cũ vẫn còn giá trị sử dụng cao</p>
          </div>
          <div className="item">
            <h3>Liên Kết</h3>
            <div className="contactPartnerIcon">
              <ContactPartnerIcon />
            </div>
            <p>
              Liên kết với hệ thống của chúng tôi để bán những sản phẩm của bạn
            </p>
          </div>
        </div>
      </section>
      <section className="section4">
        <h1>Hoạt động</h1>
        <p>2 chu trình hoạt động riêng biệt với từng nhu cầu và vai trò</p>
        <div className="howItWorks">
          <div className="left">
            <img src={Laptop} alt="" />
          </div>
          <div className="right">
            <div className="withCustomer">
              <h3>Đối với khách hàng</h3>
              <div className="item">
                <h4>1, Đăng ký:</h4>
                <p>
                  Hãy đăng ký 1 tài khoản để bắt đầu sử dụng các dịch vụ của
                  chúng tôi
                </p>
              </div>
              <div className="item">
                <h4>2, Tìm kiếm:</h4>
                <p>Tìm kiếm chiếc xe phù hợp với nhu cầu của bạn</p>
              </div>
              <div className="item">
                <h4>3, Đặt lịch:</h4>
                <p>Đặt lịch hẹn để có thể đến tận nơi để xem xe</p>
              </div>
              <div className="item">
                <h4>4, Thanh toán - Nhận xe:</h4>
                <p>Thanh toán, nhận xe khi đáp ứng thỏa thuận</p>
              </div>
            </div>
            <div className="withPartner">
              <h3>Đối với đối tác</h3>
              <div className="item">
                <h4>1, Đăng ký:</h4>
                <p>Hãy đăng ký để trở thành đối tác của chúng tối</p>
              </div>
              <div className="item">
                <h4>2, Đăng bán:</h4>
                <p>Đăng bán chiếc xe của bạn lên hệ thống của chúng tôi</p>
              </div>
              <div className="item">
                <h4>3, Nhận lịch:</h4>
                <p>Nhận lịch xem xe tận nơi của khách hàng</p>
              </div>
              <div className="item">
                <h4>4, Nhận thanh toán - Giao xe:</h4>
                <p>Nhận thanh toán, giao xe khi đáp ứng thỏa thuận</p>
              </div>
              <div className="item">
                <i>
                  *Đặc biệt, đối tác có thể gửi xe ở các cơ sở của chúng tôi,
                  chúng tôi sẽ thực hiện nhận lịch và tiếp đón khách hàng thay
                  cho đối tác*
                </i>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loading && <Loading></Loading>}
    </div>
  );
};

export default HomePage;
