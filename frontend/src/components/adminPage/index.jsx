//
import { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// store
import { Store } from '../../Store';
//
import './style.css';

const component = "component";
const activeComponent = "component activeComponent";
const subComponent = "subComponent";
const activeSubComponent = "subComponent activeSubComponent";
const div = "div";
const activeDiv = "activeDiv";

const AdminPage = () => {
    const navigate = useNavigate();
    const store = useContext(Store);
    useEffect(() => {
        if (!store.currentUser) {
            navigate('/');
        };
        if (store.currentUser) {
            const role = store.currentUser.role;
            if (role !== 'ADMIN') {
                navigate('/');
            };
        };
    }, []);
    const pathname = useLocation().pathname;
    const splitPathname = pathname.split('/');
    console.log(splitPathname);
    return (
        <div className='adminPage'>
            <div className='left'>
                <h5
                    onClick={() => navigate('')}
                    className={pathname === "/admin" ? activeComponent : component}
                    >Trang quản trị
                </h5>
                <h5
                    onClick={() => navigate('users/all')}
                    className={
                        pathname === "/admin/users/all" ||
                        pathname === "/admin/users/admin" ||
                        pathname === "/admin/users/provider" ||
                        pathname === "/admin/users/customer" ||
                        pathname === "/admin/users/applys" ||
                        splitPathname[3] === "viewUserInfo" ||
                        splitPathname[3] === "editUserInfo"
                        ? activeComponent : component}
                    >Thành viên
                </h5>
                <div
                    className={
                        pathname === "/admin/users/all" ||
                        pathname === "/admin/users/admin" ||
                        pathname === "/admin/users/provider" ||
                        pathname === "/admin/users/customer" ||
                        pathname === "/admin/users/applys" ||
                        splitPathname[3] === "viewUserInfo" ||
                        splitPathname[3] === "editUserInfo"
                        ? activeDiv : div}>
                    <p 
                        onClick={() => navigate('users/all')}
                        className={
                            pathname === "/admin/users/all" ||
                            pathname === "/admin/users/admin" ||
                            pathname === "/admin/users/provider" ||
                            pathname === "/admin/users/customer"
                            ? activeSubComponent : subComponent}
                        >Tất cả thành viên
                    </p>
                    <p 
                        onClick={() => navigate('users/applys')}
                        className={
                            pathname === "/admin/users/applys"
                            ? activeSubComponent : subComponent}
                        >Đơn đăng ký 
                    </p>
                    <p 
                        style={splitPathname[3] === "viewUserInfo" ? {display:'block', fontSize:'12px', color:'#FFFFFF', fontWeight:'bold', cursor:'pointer', transition:'all 0.5s ease',} : {display:'none'}}
                        >Xem thông tin thành viên
                    </p>
                    <p 
                        style={splitPathname[3] === "editUserInfo" ? {display:'block', fontSize:'12px', color:'#FFFFFF', fontWeight:'bold', cursor:'pointer', transition:'all 0.5s ease',} : {display:'none'}}
                        >Sửa thông tin thành viên
                    </p>
                </div>
                <h5
                    onClick={() => navigate('cars/all')}
                    className={
                        pathname === "/admin/cars/all" ||
                        pathname === "/admin/cars/approved" ||
                        pathname === "/admin/cars/pending" ||
                        splitPathname[3] === "carsByBrand" ||
                        splitPathname[3] === "carsByState" ||
                        splitPathname[3] === "carsByProvider" ||
                        splitPathname[3] === "editCarInfo"
                        ? activeComponent : component}
                    >Xe
                </h5>
                <div
                    className={
                        pathname === "/admin/cars/all" ||
                        pathname === "/admin/cars/approved" ||
                        pathname === "/admin/cars/pending" ||
                        splitPathname[3] === "carsByBrand" ||
                        splitPathname[3] === "carsByState" ||
                        splitPathname[3] === "carsByProvider" ||
                        splitPathname[3] === "editCarInfo"
                        ? activeDiv : div}>
                    <p 
                        onClick={() => navigate('cars/all')}
                        className={
                            pathname === "/admin/cars/all" ||
                            pathname === "/admin/cars/approved" ||
                            pathname === "/admin/cars/pending" ||
                            splitPathname[3] === "carsByBrand" ||
                            splitPathname[3] === "carsByState" ||
                            splitPathname[3] === "carsByProvider"
                            ? activeSubComponent : subComponent}
                        >Tất cả xe
                    </p>
                    <p 
                        style={splitPathname[3] === "editCarInfo" ? {display:'block', fontSize:'12px', color:'#FFFFFF', fontWeight:'bold', cursor:'pointer', transition:'all 0.5s ease',} : {display:'none'}}
                        >Sửa thông tin xe
                    </p>
                </div>
                <h5
                    onClick={() => navigate('news/all')}
                    className={
                        pathname === "/admin/news/all" ||
                        pathname === "/admin/news/published" ||
                        pathname === "/admin/news/draft" ||
                        pathname === "/admin/news/createNews" ||
                        splitPathname[3] === "editNews" ||
                        splitPathname[3] === "newsByCategory"
                        ? activeComponent : component}
                    >Bài viết
                </h5>
                <div
                    className={
                        pathname === "/admin/news/all" ||
                        pathname === "/admin/news/published" ||
                        pathname === "/admin/news/draft" ||
                        pathname === "/admin/news/createNews" ||
                        splitPathname[3] === "editNews" ||
                        splitPathname[3] === "newsByCategory"
                        ? activeDiv : div}>
                    <p 
                        onClick={() => navigate('news/all')}
                        className={
                            pathname === "/admin/news/all" ||
                            pathname === "/admin/news/published" ||
                            pathname === "/admin/news/draft" ||
                            splitPathname[3] === "newsByCategory"
                            ? activeSubComponent : subComponent}
                        >Tất cả bài viết
                    </p>
                    <p 
                        onClick={() => navigate('news/createNews')}
                        className={pathname ===
                            "/admin/news/createNews"
                            ? activeSubComponent : subComponent}
                        >Tạo bài viết mới
                    </p>
                    <p 
                        style={splitPathname[3] === "editNews" ? {display:'block', fontSize:'12px', color:'#FFFFFF', fontWeight:'bold', cursor:'pointer', transition:'all 0.5s ease',} : {display:'none'}}
                        >Sửa bài viết
                    </p>
                </div>
                <h5 
                    onClick={() => navigate('comments/all')}
                    className={pathname === "/admin/comments/all" ||
                        pathname === "/admin/comments/approved" ||
                        pathname === "/admin/comments/spam" ||
                        splitPathname[3] === "commentsByNews"
                        ? activeComponent : component}
                    >Bình luận
                </h5>
                <div
                    className={
                        pathname === "/admin/comments/all" ||
                        pathname === "/admin/comments/approved" ||
                        pathname === "/admin/comments/spam"
                        ? activeDiv : div}>
                    <p 
                        onClick={() => navigate('comments/all')}
                        className={
                            pathname === "/admin/comments/all" ||
                            pathname === "/admin/comments/approved" ||
                            pathname === "/admin/comments/spam"
                            ? activeSubComponent : subComponent}
                        >Tất cả bình luận
                    </p>
                </div>
            </div>
            <div className='right'>
                <Outlet/>
            </div>
        </div>
    )
}

export default AdminPage