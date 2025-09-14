import { useState, useEffect } from 'react';
import Loading from '../Loading';
import './style.css';

const IntroducePage = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className='introducePage'>
            <div className='title'>
                <h1>GIỚI THIỆU</h1>
            </div>
            <div className='companyInfo'>
                <div className='nameCompany gr'>
                    <h4>CÔNG TY TRÁCH NHIỆM HỮU HẠN THƯƠNG MẠI PROCAR</h4>
                </div>
                <div className='headOffice gr'>
                    <h4>Trụ sở chính:</h4>
                    <p>22 Thanh Cong, Ba Dinh, Ha Noi</p>
                </div>
                <div className='office gr'>
                    <h4>Office:</h4>
                    <p>22 Thanh Cong, Ba Dinh, Ha Noi</p>
                </div>
                <div className='hotline gr'>
                    <h4>Hotline:</h4>
                    <p>0123456789</p>
                </div>
                <div className='email gr'>
                    <h4>Email:</h4>
                    <p>contact@procar.com</p>
                </div>
            </div>
            <div className='content'>
                <h4>Kinh gửi quý khách hàng và đối tác!</h4>
                <p>Chúng tôi, CÔNG TY TRÁCH NHIỆM HỮU HẠN THƯƠNG MẠI VẬN PROCAR, xin gửi đến quý khách hàng lời chúc sức khỏe và thành công trong cuộc sống.</p>
                <p>Kể từ khi thành lập đến nay, công ty chúng tôi luôn nỗ lực không ngừng để phát triển và hoàn thiện các dịch vụ của mình, nhờ sự tin tưởng và lựa chọn của quý khách hàng. Chúng tôi tự hào là một trong những hệ thống bán xe chuyên nghiệp và uy tín hàng đầu tại Việt Nam, cung cấp dịch vụ với mức giá cạnh tranh nhất và chất lượng dịch vụ cao nhất.</p>
                <div className='grServices'>
                    <h5>Các dịch vụ mà chúng tôi cung cấp:</h5>
                    <div className='services'>
                        <p>- Cung cấp những mẫu xe nhập nguyên chiếc từ hãng.</p>
                        <p>- Cung cấp những chiếc xe cũ vẫn còn giá trị sử dụng cao.</p>
                        <p>- Liên kết với hệ thống của chúng tôi để bán những sản phẩm của bạn.</p>
                    </div>
                </div>
                <div className='grServeMotto'>
                    <h5>Phương châm phục vụ:</h5>
                    <p>“UY TÍN - CHẤT LƯỢNG - ẤN TƯỢNG - HÀI LÒNG”.</p>
                </div>
                <div className='grOurMission'>
                    <h5>Sứ mệnh của chúng tôi:</h5>
                    <p>"Phục vụ khách hàng ngoài sự mong đợi".</p>
                </div>
                <div className='grAchievedResults'>
                    <h5>Kết quả đạt được:</h5>
                    <p>Công ty chúng tôi đã trở thành sự lựa chọn hàng đầu của nhiều khách hàng. Đội ngũ tư vấn tận tình luôn sẵn sàng phục vụ bạn.</p>
                </div>
                <div className='grTargets'>
                    <h5>Mục tiêu:</h5>
                    <div className='targets'>
                        <p>- Tạo dựng hình ảnh công ty mang bản sắc văn hóa riêng, để lại ấn tượng tốt nhất cho khách hàng.</p>
                        <p>- Luôn lắng nghe ý kiến ​​khách hàng và cải tiến dịch vụ.</p>
                        <p>- Mở rộng chi nhánh tại các tỉnh, thành phố lớn trên toàn quốc trong thời gian tới.</p>
                    </div>
                </div>
                <div className='grEnd'>
                    <p>Hãy để Công ty ProCar là người bạn đồng hành đáng tin cậy mỗi khi bạn muốn sở hữu một chiếc mơ ước. Sự tin tưởng của bạn sẽ là động lực để chúng tôi mang lại niềm vui và sự hài lòng cho bạn!</p>
                </div>
            </div>
            {loading && <Loading></Loading>}
        </div>
    )
}

export default IntroducePage