import { useState, useEffect } from 'react';
import Loading from '../Loading';
// svgs
import PhoneIcon from '../../icons/contactPage/PhoneIcon';
import EmailIcon from '../../icons/contactPage/EmailIcon';
import AddressIcon from '../../icons/contactPage/AddressIcon';
//
import './style.css';   

const ContactPage = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className='contactPage'>
            <div className='title'>
                <h1>LIÊN HỆ</h1>
            </div>
            <div className='content'>
                <form action="" className='left'>
                    <div className='gr'>
                        <label htmlFor="name">Tên</label>
                        <input type="text" id='name' placeholder='Họ và tên'/>
                    </div>
                    <div className='gr'>
                        <label htmlFor="email">Email</label>
                        <input type="text" id='email' placeholder='Điền email'/>
                    </div>
                    <div className='gr'>
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <input type="text" id='phoneNumber' placeholder='Điền số điện thoại'/>
                    </div>
                    <div className='gr'>
                        <label htmlFor="comment">Bình luận</label>
                        <textarea id="comment" placeholder='Bình luận gì đó'></textarea>
                    </div>
                    <div className='gr'>
                        <button type='button'>Gửi</button>
                    </div>
                </form>
                <div className='right'>
                    <div className='contentRight'>
                        <div className='item'>
                            <div className='grIcon'>
                                <PhoneIcon/>
                                <h4>Phone</h4>
                            </div>
                            <h4>0123-456-789</h4>
                        </div>
                        <div style={{width:'100%', height:'1px', backgroundColor:'#3563E9', margin:'20px 0'}}></div>
                        <div className='item'>
                            <div className='grIcon'>
                                <EmailIcon/>
                                <h4>Email</h4>
                            </div>
                            <h4>contact@procar.com</h4>
                        </div>
                        <div style={{width:'100%', height:'1px', backgroundColor:'#3563E9', margin:'20px 0'}}></div>
                        <div className='item'>
                            <div className='grIcon'>
                                <AddressIcon/>
                                <h4>Address</h4>
                            </div>
                            <h4>22 Thanh Cong, Ba Dinh, Ha Noi</h4>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <Loading></Loading>}
        </div>
    )
}

export default ContactPage