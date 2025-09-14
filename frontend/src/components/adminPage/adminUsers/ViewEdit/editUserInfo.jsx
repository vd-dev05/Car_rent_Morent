import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import axios from 'axios';
import { message } from "antd";
// Store
import { Store } from '../../../../Store';
//
import Loading from "../../../Loading";
import './style.css';

const EditUserInfo = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const store = useContext(Store);
    let accessToken;
    if (store.currentUser) {
        accessToken = store.currentUser.accessToken
    };
    // màn hình hiển thị ở đầu trang khi mở trang lên, thiết lập thanh cuộn trên đầu trang
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // queryUserInfo
    const {id} = useParams();
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [avatar, setAvatar] = useState('');
    const [img, setImg] = useState('');
    const queryUserInfo = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/users/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
            const info = response.data.data;
            setRole(info.role);
            setUsername(info.username);
            setEmail(info.email);
            setFullname(info.fullname);
            setPhoneNumber(info.phoneNumber);
            setAddress(info.address);
            if (info.dateOfBirth) {
                setDateOfBirth(moment(info.dateOfBirth).format('YYYY-MM-DD'));
            };
            setImg(info.avatar);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                switch (error.response.data.message) {
                    case 'jwt expired': {
                        message.error(('Token đã hết hạn, vui lòng đăng nhập lại!'))
                        .then(() => {
                            store.setCurrentUser(null);
                            navigate('/login');
                        })
                        return
                    };
                    default:
                    return message.error((error.response.data.message));
                }
            } else {
                message.error('Lỗi không xác định');
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        queryUserInfo();
    }, []);
    // submit
    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
        setImg(URL.createObjectURL(e.target.files[0]));
    };
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const payloadFormData = new FormData();
        payloadFormData.append('username', username);
        payloadFormData.append('email', email);
        payloadFormData.append('fullname', fullname);
        payloadFormData.append('phoneNumber', phoneNumber);
        payloadFormData.append('address', address);
        payloadFormData.append('dateOfBirth', dateOfBirth);
        payloadFormData.append('avatar', avatar);
        try {
            const response = await axios.put(`${API_BASE_URL}/api/v1/users/modify/${id}`, payloadFormData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-type": "multipart/form-data",
                },
            });
            message.loading('Đang cập nhật!', 1)
            .then(() => {
                message.success((response.data.message), 2);
                setLoading(false);
                // navigate('/admin/users/all');
                window.history.back();
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                switch (error.response.data.message) {
                    case 'jwt expired': {
                        message.error(('Token đã hết hạn, vui lòng đăng nhập lại!'))
                        .then(() => {
                            store.setCurrentUser(null);
                            navigate('/login');
                        })
                        return
                    };
                    default:
                    return message.error((error.response.data.message));
                }
            } else {
                message.error('Lỗi không xác định');
            }
            setLoading(false);
        }
    };
    return (
        <div className='ViewEdit'>
            <h3>Chỉnh sửa hồ sơ</h3>
            <div className='grAvatar'>
                <h4>Ảnh đại diện</h4>
                <div className='avatar'>
                    <h5>Avatar</h5>
                    <div>
                        <img src={img} alt="" />
                        <input type="file" onChange={handleFileChange}/>
                    </div>
                </div>
            </div>
            <div className='baseInfo'>
                <h4>Thông tin cơ bản</h4>
                <div className='grUsername'>
                    <label htmlFor="username">Username</label>
                    <input disabled={role === 'ADMIN'} type="text" id='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className='grEmail'>
                    <label htmlFor="email">Email</label>
                    <input disabled={role === 'ADMIN'} type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                {role === 'ADMIN' ?
                <i>* Không thể chỉnh sửa Username và Email của tài khoản quản trị viên</i> :
                ''}
            </div>
            <div className='grOtherInfo'>
                <h4>Thông tin khác</h4>
                <div className='grFullname'>
                    <label htmlFor="fullname">Họ tên</label>
                    <input type="text" id='fullname' value={fullname} onChange={(e) => setFullname(e.target.value)}/>
                </div>
                <div className='grPhoneNumber'>
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <input type="text" id='phoneNumber' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                </div>
                <div className='grAddress'>
                    <label htmlFor="address">Địa chỉ</label>
                    <input type="text" id='address' value={address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                <div className='grDateOfBirth'>
                    <label htmlFor="dateOfBirth">Ngày sinh</label>
                    <input type="date" id='dateOfBirth' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}/>
                </div>
            </div>
            <div className='grButton'>
                <button onClick={handleSubmit}>Cập nhật</button>
                <button onClick={() => window.history.back()}>Quay lại</button>
            </div>
        {loading && <Loading></Loading>}
      </div>
    )
}

export default EditUserInfo