import { useNavigate } from 'react-router-dom';
// imgs
import PageNotFound from '/public/imgs/pageNotFound.png';
//
import './style.css';

const NotFoundPage = () => {
    const navigate = useNavigate();
    // return (
    //     <div className='notFoundPage'>
    //         <div className='div1'>404</div>
    //         <div className='div2'>Page Not Found</div>
    //     </div>
    // )
    return (
        <div className='notFoundPage'>
            <img src={PageNotFound} alt="" />
            <button onClick={() => navigate('/')}>Truy cập trang chủ</button>
        </div>
    )
}

export default NotFoundPage