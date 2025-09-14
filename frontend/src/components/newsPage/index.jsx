import {Link, NavLink, Outlet} from 'react-router-dom';
//
import './style.css';

const activeLink = (params) => {
    return params.isActive ? "activeLink navLink" : "link"
};

const NewsPage = () => {
    return (
        <div className='newsPage'>
             <div className='groupNav'>
                <h1><Link className='link' to={'/news'}>Tin Tức</Link></h1>
                <nav className='menu'>
                    <NavLink className={activeLink} to='carNews'>Tin xe</NavLink>
                    <NavLink className={activeLink} to='marketNews'>Tin thị trường</NavLink>
                    <NavLink className={activeLink} to='explore'>Khám phá</NavLink>
                </nav>
            </div>
            <Outlet />
        </div>
    )
}

export default NewsPage