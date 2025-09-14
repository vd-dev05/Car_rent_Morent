import { useState, useEffect } from 'react';
// icons
import Icon1 from '../../../icons/adminPage/Icon1';
import Icon2 from '../../../icons/adminPage/Icon2';
import Icon3 from '../../../icons/adminPage/Icon3';
//
import Loading from '../../Loading';
import "./style.css"

const AdminOverview = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className="adminOverview">
            <h3>Trang quản trị</h3>
            <div className='main'>
                <div className='welcomeBanner'>
                    <h1>Chào mừng tới trang quản trị của ProCar</h1>
                </div>
                <div className="content">
                    <div className='item'>
                        <div className='icon'><Icon1/></div>
                        <div className='text'>
                            <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa.</p>
                        </div>
                    </div>
                    <div className='item'>
                        <div className='icon'><Icon2/></div>
                        <div className='text'>
                            <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa.</p>
                        </div>
                    </div>
                    <div className='item'>
                        <div className='icon'><Icon3/></div>
                        <div className='text'>
                            <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa.</p>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <Loading></Loading>}
        </div>
    )
}

export default AdminOverview